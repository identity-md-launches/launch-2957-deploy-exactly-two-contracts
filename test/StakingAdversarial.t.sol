// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {StakingBase} from "./Staking.t.sol";
import {IMDuelToken} from "src/IMDuelToken.sol";
import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {IERC20Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";

/// Exercise failures after settlement as well as ERC-4626's rounding and allowance boundaries.
/// forge-config: default.fuzz.runs = 1000
contract StakingAdversarialTest is StakingBase {
    address alice = makeAddr("adversarial staker");
    address bob = makeAddr("adversarial delegate");

    function _state() private view returns (bytes32) {
        return keccak256(
            abi.encode(
                vault.totalAssets(),
                vault.reserve(),
                vault.totalSupply(),
                vault.balanceOf(DEAD),
                vault.balanceOf(alice),
                vault.balanceOf(bob),
                vault.allowance(alice, bob),
                token.balanceOf(address(vault)),
                token.balanceOf(alice),
                token.balanceOf(bob),
                token.allowance(alice, address(vault))
            )
        );
    }

    function test_mintIsClosedAtOneWeiBelowSeedAndOpensAtExactThreshold() public {
        _open(DEAD_SHARES - 1);
        _wait(365 days);
        bytes32 before_ = _state();
        vm.expectRevert(abi.encodeWithSelector(ERC4626.ERC4626ExceededMaxMint.selector, alice, 1, 0));
        vault.mint(1, alice);
        assertEq(_state(), before_);
        assertEq(vault.maxDeposit(alice), 0);
        assertEq(vault.totalAssets(), 0);
        assertEq(vault.reserve(), DEAD_SHARES - 1);

        token.transfer(address(vault), 1);
        vault.sync();
        assertEq(vault.totalAssets(), DEAD_SHARES);
        assertEq(vault.reserve(), 0);
        assertEq(vault.totalSupply(), DEAD_SHARES);
        assertEq(vault.balanceOf(DEAD), DEAD_SHARES);
        token.approve(address(vault), 1);
        assertEq(vault.mint(1, alice), 1);
        assertEq(vault.balanceOf(alice), 1);
    }

    function test_failedDepositsAndMintsRollBackSettlementAndTokenAllowance() public {
        _open(SEED);
        _stake(bob, 1e18);
        token.transfer(alice, 10e18);
        _wait(3 days);
        bytes32 before_ = _state();
        vm.startPrank(alice);
        vm.expectRevert(IMDuelToken.InsufficientAllowance.selector);
        vault.deposit(1e18, alice);
        vm.expectRevert(IMDuelToken.InsufficientAllowance.selector);
        vault.mint(1e18, alice);
        vm.stopPrank();
        assertEq(_state(), before_, "failed deposits must not keep their accounting updates");

        vm.prank(alice);
        token.approve(address(vault), type(uint256).max);
        before_ = _state();
        vm.prank(alice);
        vm.expectRevert(IMDuelToken.InsufficientBalance.selector);
        vault.deposit(10e18 + 1, alice);
        assertEq(_state(), before_);

        // This failure occurs after transferFrom, so its allowance and transfer must also unwind.
        vm.prank(alice);
        token.approve(address(vault), 10e18);
        before_ = _state();
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(IERC20Errors.ERC20InvalidReceiver.selector, address(0)));
        vault.deposit(1e18, address(0));
        assertEq(_state(), before_);
    }

    function test_failedExitToZeroRollsBackBurnAllowanceAndSettlement() public {
        _open(SEED);
        uint256 shares = _stake(alice, 100e18);
        vm.prank(alice);
        vault.approve(bob, shares);
        _wait(3 days);
        bytes32 before_ = _state();
        vm.prank(bob);
        vm.expectRevert(IMDuelToken.InvalidAddress.selector);
        vault.redeem(shares, address(0), alice);
        assertEq(_state(), before_);

        uint256 assets = vault.maxWithdraw(alice);
        vm.prank(bob);
        vm.expectRevert(IMDuelToken.InvalidAddress.selector);
        vault.withdraw(assets, address(0), alice);
        assertEq(_state(), before_);

        vm.prank(bob);
        assertEq(vault.redeem(shares, bob, alice), assets, "a failed exit must not impair a later valid exit");
        assertEq(vault.allowance(alice, bob), 0);
        assertEq(vault.balanceOf(alice), 0);
    }

    function test_exitsCannotExceedOwnerBalanceOrUseAnothersShares() public {
        _open(SEED);
        uint256 shares = _stake(alice, 100e18);
        _wait(7 days);
        uint256 assets = vault.maxWithdraw(alice);
        uint256 required = vault.previewWithdraw(1e18);
        bytes32 before_ = _state();
        vm.startPrank(bob);
        vm.expectRevert(abi.encodeWithSelector(ERC4626.ERC4626ExceededMaxWithdraw.selector, alice, assets + 1, assets));
        vault.withdraw(assets + 1, bob, alice);
        vm.expectRevert(abi.encodeWithSelector(ERC4626.ERC4626ExceededMaxRedeem.selector, alice, shares + 1, shares));
        vault.redeem(shares + 1, bob, alice);
        vm.expectRevert(abi.encodeWithSelector(IERC20Errors.ERC20InsufficientAllowance.selector, bob, 0, required));
        vault.withdraw(1e18, bob, alice);
        vm.expectRevert(abi.encodeWithSelector(IERC20Errors.ERC20InsufficientAllowance.selector, bob, 0, shares));
        vault.redeem(shares, bob, alice);
        vm.stopPrank();
        assertEq(_state(), before_);
    }

    function test_delegatedWithdrawalConsumesSharesNotAssetsAndCannotReplay() public {
        _open(SEED);
        _stake(alice, 1e18);
        _wait(30 days);
        uint256 assets = 10e18;
        uint256 required = vault.previewWithdraw(assets);
        assertLt(required, assets, "exercise an exchange rate above one");
        vm.prank(alice);
        vault.approve(bob, required - 1);
        bytes32 before_ = _state();
        vm.prank(bob);
        vm.expectRevert(
            abi.encodeWithSelector(IERC20Errors.ERC20InsufficientAllowance.selector, bob, required - 1, required)
        );
        vault.withdraw(assets, bob, alice);
        assertEq(_state(), before_);
        vm.prank(alice);
        vault.approve(bob, required);
        vm.prank(bob);
        assertEq(vault.withdraw(assets, bob, alice), required);
        assertEq(token.balanceOf(bob), assets);
        assertEq(vault.allowance(alice, bob), 0);
        vm.prank(bob);
        vm.expectRevert(abi.encodeWithSelector(IERC20Errors.ERC20InsufficientAllowance.selector, bob, 0, 1));
        vault.redeem(1, bob, alice);

        vm.prank(alice);
        vault.approve(bob, type(uint256).max);
        uint256 remaining = vault.balanceOf(alice);
        vm.prank(bob);
        vault.redeem(remaining, bob, alice);
        assertEq(vault.allowance(alice, bob), type(uint256).max);
        assertEq(vault.balanceOf(alice), 0);
    }

    function test_fullFixedSupplyCanBeHeldAndReleasedWithoutNarrowing() public {
        _open(DEAD_SHARES);
        uint256 rest = token.balanceOf(address(this));
        token.approve(address(vault), rest);
        assertEq(vault.deposit(rest, alice), rest);
        assertEq(token.balanceOf(address(vault)), token.totalSupply());
        assertEq(vault.totalAssets(), token.totalSupply());
        assertEq(vault.reserve(), 0);
        _wait(3650 days);
        vm.prank(alice);
        assertEq(vault.redeem(rest, alice, alice), rest);
        assertEq(vault.totalAssets(), DEAD_SHARES);
        assertEq(vault.totalSupply(), DEAD_SHARES);
    }

    function test_maxUintDepositCannotTruncateIntoAFreeMint() public {
        _open(DEAD_SHARES);
        vm.prank(alice);
        token.approve(address(vault), type(uint256).max);
        bytes32 before_ = _state();
        vm.prank(alice);
        vm.expectRevert(IMDuelToken.InsufficientBalance.selector);
        vault.deposit(type(uint256).max - DEAD_SHARES, alice);
        assertEq(_state(), before_);
    }

    function test_zeroOperationsDoNotCreateSharesOrConsumeTheReserve() public {
        _open(SEED);
        bytes32 before_ = _state();
        vm.startPrank(alice);
        assertEq(vault.deposit(0, alice), 0);
        assertEq(vault.mint(0, alice), 0);
        assertEq(vault.withdraw(0, alice, alice), 0);
        assertEq(vault.redeem(0, alice, alice), 0);
        vm.stopPrank();
        vault.sync();
        vault.sync();
        assertEq(_state(), before_);
        _wait(365 days);
        assertEq(_state(), before_, "no redeemable shares means no release");
    }

    function testFuzz_repeatedMintRedeemCyclesNeverCreateProfit(uint256 stake, uint256 delay, uint256 units) public {
        _open(SEED);
        _stake(alice, bound(stake, 1, 100_000_000e18));
        _wait(bound(delay, 0, 3650 days));
        token.transfer(bob, 100_000_000e18);
        uint256 before_ = token.balanceOf(bob);
        uint256 shares = bound(units, 1, vault.convertToShares(before_) / 32);
        uint256 reserveBefore = vault.reserve();
        vm.startPrank(bob);
        token.approve(address(vault), type(uint256).max);
        for (uint256 i; i < 16; ++i) {
            uint256 preview = vault.previewMint(shares);
            uint256 paid = vault.mint(shares, bob);
            assertEq(paid, preview);
            uint256 received = vault.redeem(shares, bob, bob);
            assertLe(received, paid, "rounding must not pay a flash staker");
        }
        vm.stopPrank();
        assertLe(token.balanceOf(bob), before_);
        assertEq(vault.balanceOf(bob), 0);
        assertEq(vault.reserve(), reserveBefore, "cycles at one timestamp cannot release rewards");
        assertEq(vault.totalAssets() + vault.reserve(), token.balanceOf(address(vault)));
    }

    function testFuzz_newDonationIsNotBackdatedAcrossIdleTime(uint256 donation, uint256 delay) public {
        _open(DEAD_SHARES);
        _stake(alice, 1e18);
        _wait(bound(delay, 1, 3650 days));
        donation = bound(donation, 1, 100_000_000e18);
        uint256 assets = vault.totalAssets();
        token.transfer(address(vault), donation);
        assertEq(vault.totalAssets(), assets);
        assertEq(vault.reserve(), donation);
        vault.sync();
        assertEq(vault.totalAssets(), assets, "new funds did not exist during the idle interval");
        assertEq(vault.reserve(), donation);
        _wait(1 days);
        assertLt(vault.reserve(), donation);
        assertEq(vault.totalAssets() + vault.reserve(), assets + donation);
    }
}
