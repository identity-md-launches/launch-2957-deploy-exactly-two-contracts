// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {StakingBase} from "./Staking.t.sol";
import {IMDuelStaking} from "../src/IMDuelStaking.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StakingAuditTest is StakingBase {
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    /// Imported audit 836357b2: the exact 1-wei, 30-day attack, now with no release at all.
    function test_oneWeiParkedAtDeadCannotDrainTheReserve() public {
        _open(SEED);
        uint256 reserve = vault.reserve();
        uint256 shares = _stake(alice, 1);
        assertEq(shares, 1);
        vm.prank(alice);
        vault.transfer(DEAD, shares);
        assertEq(vault.balanceOf(alice), 0);
        assertEq(vault.totalSupply(), DEAD_SHARES + 1);
        _wait(30 days);
        assertEq(vault.reserve(), reserve);
        assertEq(_value(DEAD), DEAD_SHARES + 1);
        assertEq(vault.totalAssets() + vault.reserve(), token.balanceOf(address(vault)));
    }

    function test_oneWeiKeptEnablesOnlyADustRelease() public {
        _open(SEED);
        uint256 reserve = vault.reserve();
        _stake(alice, 1);
        _wait(30 days);
        assertLe(reserve - vault.reserve(), 1e12, "at most one millionth of a token");
        assertLe(_value(DEAD) - DEAD_SHARES, 1e12);
        uint256 price = vault.convertToAssets(1e18);
        vault.sync();
        assertEq(vault.convertToAssets(1e18), price);
        _leave(alice);
        reserve = vault.reserve();
        _wait(30 days);
        assertEq(vault.reserve(), reserve);
    }

    function test_syncEverySecondCannotAmplifyADustRelease() public {
        _open(SEED);
        _stake(alice, 1);
        uint256 reserve = vault.reserve();
        for (uint256 i; i < 1000; ++i) {
            _wait(1);
            vault.sync();
        }
        // R * (1 - KEEP) * 1000 / (1e18 + 1), plus at most one wei of rounding per settlement.
        assertLe(reserve - vault.reserve(), 2200);
    }

    function testFuzz_allSharesParkedAtDeadStopRelease(uint256 amount, uint256 delay, bool delegated) public {
        amount = bound(amount, 1, 100_000_000e18);
        delay = bound(delay, 0, 3650 days);
        _open(SEED);
        uint256 shares = _stake(alice, amount);
        _wait(delay);
        uint256 reserve = vault.reserve();
        uint256 assets = vault.totalAssets();
        uint256 price = vault.convertToAssets(1e18);
        if (delegated) {
            vm.prank(alice);
            vault.approve(bob, shares);
            vm.prank(bob);
            vault.transferFrom(alice, DEAD, shares);
        } else {
            vm.prank(alice);
            vault.transfer(DEAD, shares);
        }
        assertEq(vault.totalAssets(), assets, "accrued rewards survive the transfer");
        assertEq(vault.convertToAssets(1e18), price);
        _wait(365 days);
        vault.sync();
        assertEq(vault.reserve(), reserve);
        assertEq(vault.totalAssets(), assets);
        _stake(bob, 1_000_000e18);
        assertApproxEqAbs(_value(bob), 1_000_000e18, 1e10, "no rewards backdated across the wait");
    }

    function test_depositsAndMintsToDeadDoNotEnableRelease() public {
        _open(SEED);
        token.approve(address(vault), 2_000_000e18);
        vault.deposit(1_000_000e18, DEAD);
        vault.mint(1_000_000e18, DEAD);
        assertEq(vault.totalSupply(), vault.balanceOf(DEAD));
        uint256 reserve = vault.reserve();
        uint256 assets = vault.totalAssets();
        _wait(365 days);
        assertEq(vault.reserve(), reserve);
        assertEq(vault.totalAssets(), assets);
    }

    function test_partialTransferToDeadSettlesBeforeSlowingRelease() public {
        _open(SEED);
        uint256 shares = _stake(alice, 1e18);
        IMDuelStaking control = _comparisonVault(1e18);
        _wait(1 days);
        uint256 assets = vault.totalAssets();
        uint256 reserve = vault.reserve();
        vm.prank(alice);
        vault.transfer(DEAD, shares / 2);
        control.sync();
        assertEq(vault.totalAssets(), assets);
        assertEq(vault.reserve(), reserve);
        assertEq(control.reserve(), reserve);
        _wait(1 days);
        assertGt(vault.reserve(), control.reserve(), "the extra dead shares reduce the future rate");
        assertGt(vault.totalAssets(), assets, "the remaining redeemable shares still earn");
    }

    function testFuzz_releaseIsIndependentOfSettlementFrequency(uint256 amount, uint256 a, uint256 b) public {
        amount = bound(amount, 1, 100_000_000e18);
        a = bound(a, 0, 3650 days);
        b = bound(b, 0, 3650 days);
        _open(SEED);
        _stake(alice, amount);
        IMDuelStaking once = _comparisonVault(amount);
        _wait(a);
        vault.sync();
        _wait(b);
        vault.sync();
        assertApproxEqAbs(vault.reserve(), once.reserve(), 1e3);
        assertApproxEqAbs(vault.totalAssets(), once.totalAssets(), 1e3);
        assertEq(vault.totalAssets() + vault.reserve(), SEED + amount);
    }

    function _comparisonVault(uint256 stake) private returns (IMDuelStaking other) {
        other = new IMDuelStaking(IERC20(address(token)));
        token.transfer(address(other), SEED);
        other.sync();
        token.approve(address(other), stake);
        other.deposit(stake, alice);
    }
}
