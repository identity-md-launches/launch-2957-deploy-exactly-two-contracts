// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {FakePoolFees} from "./FeeRouter.t.sol";
import {IMDuelToken} from "src/IMDuelToken.sol";
import {IMDuelStaking} from "src/IMDuelStaking.sol";
import {IMDuelFeeRouter, IPoolFees, IDuelTokens, ISync} from "src/IMDuelFeeRouter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";

/// Uses the existing offline dependency fixtures. The application contracts are unmodified.
abstract contract RouterChecksBase is Test {
    uint64 internal constant LAUNCH = 2843;
    IMDuelToken internal duelToken;
    IMDuelToken internal feeToken;
    IMDuelStaking internal vault;
    FakePoolFees internal factory;
    IMDuelFeeRouter internal router;
    address internal admin = makeAddr("router checks admin");
    address internal team = makeAddr("router checks team");
    address internal stranger = makeAddr("router checks stranger");
    address internal successor = makeAddr("router checks successor");
    uint256 internal now_ = 1_762_000_000;

    function setUp() public virtual {
        vm.warp(now_);
        duelToken = new IMDuelToken();
        feeToken = new IMDuelToken();
        vault = new IMDuelStaking(IERC20(address(duelToken)));
        factory = new FakePoolFees(duelToken, feeToken, LAUNCH, address(this));
        router = _deployRouter();
        factory.setRequester(LAUNCH, address(router));
    }

    function _deployRouter() internal returns (IMDuelFeeRouter) {
        return new IMDuelFeeRouter(
            factory, LAUNCH, IERC20(address(duelToken)), IERC20(address(feeToken)), address(vault), team, admin
        );
    }

    function _accrue(uint256 a, uint256 b) internal {
        duelToken.transfer(address(factory), a);
        feeToken.transfer(address(factory), b);
        factory.accrue(a, b);
    }

    function _wait(uint256 elapsed) internal {
        now_ += elapsed;
        vm.warp(now_);
    }
}

/// forge-config: default.fuzz.runs = 1000
contract FeeRouterAdversarialTest is RouterChecksBase {
    error DependencyFailure();

    function _state() private view returns (bytes32) {
        return keccak256(
            abi.encode(
                router.admin(),
                router.pending(),
                router.readyAt(),
                factory.requester(LAUNCH),
                duelToken.balanceOf(address(factory)),
                feeToken.balanceOf(address(factory)),
                duelToken.balanceOf(address(router)),
                feeToken.balanceOf(address(router)),
                duelToken.balanceOf(address(vault)),
                feeToken.balanceOf(team),
                vault.totalAssets(),
                vault.reserve(),
                vault.totalSupply()
            )
        );
    }

    function _fundAndPropose() private {
        _accrue(100e18, 7e18);
        duelToken.transfer(address(router), 3e18);
        feeToken.transfer(address(router), 2e18);
        vm.prank(admin);
        router.propose(successor);
        _wait(3 days);
    }

    function _assertPaidOnce() private view {
        assertEq(duelToken.balanceOf(address(vault)), 103e18);
        assertEq(feeToken.balanceOf(team), 9e18);
        assertEq(duelToken.balanceOf(address(router)), 0);
        assertEq(feeToken.balanceOf(address(router)), 0);
        assertEq(duelToken.balanceOf(address(factory)), 0);
        assertEq(feeToken.balanceOf(address(factory)), 0);
        assertEq(vault.totalAssets() + vault.reserve(), 103e18);
    }

    function test_secondTokenFailureUnwindsClaimAndFirstForward() public {
        _fundAndPropose();
        bytes32 before_ = _state();
        vm.mockCall(address(feeToken), abi.encodeCall(IERC20.transfer, (team, 9e18)), abi.encode(false));
        vm.expectRevert(abi.encodeWithSelector(SafeERC20.SafeERC20FailedOperation.selector, address(feeToken)));
        router.collect();
        assertEq(_state(), before_, "first token transfer and factory accrual must roll back together");
        vm.clearMockedCalls();
        (uint256 a, uint256 b) = router.collect();
        assertEq(a, 103e18);
        assertEq(b, 9e18);
        _assertPaidOnce();
        (a, b) = router.collect();
        assertEq(a + b, 0, "retry must not duplicate a claim");
    }

    function test_syncFailureUnwindsBothForwardsAndKeepsProposalExecutable() public {
        _fundAndPropose();
        bytes32 before_ = _state();
        vm.mockCallRevert(
            address(vault), abi.encodeCall(ISync.sync, ()), abi.encodeWithSelector(DependencyFailure.selector)
        );
        vm.prank(admin);
        vm.expectRevert(DependencyFailure.selector);
        router.handOn();
        assertEq(_state(), before_);
        vm.clearMockedCalls();
        vm.prank(admin);
        router.handOn();
        _assertPaidOnce();
        assertEq(factory.requester(LAUNCH), successor);
        assertEq(router.pending(), address(0));
        assertEq(router.readyAt(), 0);
    }

    function test_setRequesterFailureUnwindsFinalCollectAndProposalClearing() public {
        _fundAndPropose();
        bytes32 before_ = _state();
        vm.mockCallRevert(
            address(factory),
            abi.encodeCall(IPoolFees.setRequester, (LAUNCH, successor)),
            abi.encodeWithSelector(DependencyFailure.selector)
        );
        vm.prank(admin);
        vm.expectRevert(DependencyFailure.selector);
        router.handOn();
        assertEq(_state(), before_, "handover is one atomic transaction including the final collect");
        vm.clearMockedCalls();
        vm.prank(admin);
        router.handOn();
        _assertPaidOnce();
        assertEq(factory.requester(LAUNCH), successor);
    }

    function test_claimFailurePreservesDonationsAndPendingHandover() public {
        _fundAndPropose();
        bytes32 before_ = _state();
        vm.mockCallRevert(
            address(factory),
            abi.encodeCall(IPoolFees.claimFees, (LAUNCH)),
            abi.encodeWithSelector(DependencyFailure.selector)
        );
        vm.expectRevert(DependencyFailure.selector);
        router.collect();
        vm.prank(admin);
        vm.expectRevert(DependencyFailure.selector);
        router.handOn();
        assertEq(_state(), before_);
        vm.clearMockedCalls();
        vm.prank(admin);
        router.handOn();
        _assertPaidOnce();
    }

    function test_onlyIMDFeesDoNotCallSync() public {
        _accrue(0, 7e18);
        vm.mockCallRevert(
            address(vault), abi.encodeCall(ISync.sync, ()), abi.encodeWithSelector(DependencyFailure.selector)
        );
        vm.prank(stranger);
        (uint256 a, uint256 b) = router.collect();
        assertEq(a, 0);
        assertEq(b, 7e18);
        assertEq(feeToken.balanceOf(team), 7e18);
        assertEq(vault.totalSupply(), 0);
        vm.clearMockedCalls();
    }

    function test_collectUsesBalancesRatherThanFactoryReturnValues() public {
        // A third party can already have claimed directly; returned deltas are not the router's balance.
        _accrue(100e18, 7e18);
        vm.prank(stranger);
        factory.claimFees(LAUNCH);
        duelToken.transfer(address(router), 3e18);
        feeToken.transfer(address(router), 2e18);
        vm.prank(stranger);
        (uint256 a, uint256 b) = router.collect();
        assertEq(a, 103e18);
        assertEq(b, 9e18);
        _assertPaidOnce();
        assertEq(duelToken.balanceOf(stranger), 0);
        assertEq(feeToken.balanceOf(stranger), 0);
    }

    function testFuzz_handoverWindowHasExactBoundaries(uint256 elapsed) public {
        elapsed = bound(elapsed, 0, 9 days);
        _accrue(100e18, 7e18);
        vm.prank(admin);
        router.propose(successor);
        _wait(elapsed);
        bytes32 before_ = _state();
        if (elapsed < 3 days) {
            vm.prank(admin);
            vm.expectRevert(IMDuelFeeRouter.NotReady.selector);
            router.handOn();
            assertEq(_state(), before_);
        } else if (elapsed > 6 days) {
            vm.prank(admin);
            vm.expectRevert(IMDuelFeeRouter.Expired.selector);
            router.handOn();
            assertEq(_state(), before_);
        } else {
            vm.prank(admin);
            router.handOn();
            assertEq(factory.requester(LAUNCH), successor);
            assertEq(duelToken.balanceOf(address(vault)), 100e18);
            assertEq(feeToken.balanceOf(team), 7e18);
            assertEq(router.pending(), address(0));
            assertEq(router.readyAt(), 0);
            vm.prank(admin);
            vm.expectRevert(IMDuelFeeRouter.NotReady.selector);
            router.handOn();
        }
    }

    function test_lockAtMaturityCancelsHandoverAndCannotBeRepeated() public {
        _fundAndPropose();
        vm.prank(admin);
        router.lock();
        assertEq(router.admin(), address(0));
        assertEq(router.pending(), address(0));
        assertEq(router.readyAt(), 0);
        bytes32 before_ = _state();
        vm.startPrank(admin);
        vm.expectRevert(IMDuelFeeRouter.NotAdmin.selector);
        router.lock();
        vm.expectRevert(IMDuelFeeRouter.NotAdmin.selector);
        router.propose(successor);
        vm.expectRevert(IMDuelFeeRouter.NotAdmin.selector);
        router.handOn();
        vm.stopPrank();
        assertEq(_state(), before_);
        vm.prank(stranger);
        router.collect();
        _assertPaidOnce();
        assertEq(factory.requester(LAUNCH), address(router));
    }

    function test_constructorRejectsMissingHookAndEitherWrongHookToken() public {
        (PoolKey memory key, int24 lower, int24 upper, address requester) = factory.positionOf(LAUNCH);
        address hook = address(key.hooks);
        key.hooks = IHooks(address(0));
        vm.mockCall(
            address(factory), abi.encodeCall(IPoolFees.positionOf, (LAUNCH)), abi.encode(key, lower, upper, requester)
        );
        vm.expectRevert(IMDuelFeeRouter.InvalidSetup.selector);
        _deployRouter();
        vm.clearMockedCalls();

        // Isolate the two hook reads; a swapped pair alone would fail before reaching these checks.
        vm.mockCall(hook, abi.encodeCall(IDuelTokens.imduel, ()), abi.encode(address(feeToken)));
        vm.expectRevert(IMDuelFeeRouter.InvalidSetup.selector);
        _deployRouter();
        vm.clearMockedCalls();
        vm.mockCall(hook, abi.encodeCall(IDuelTokens.imd, ()), abi.encode(address(duelToken)));
        vm.expectRevert(IMDuelFeeRouter.InvalidSetup.selector);
        _deployRouter();
        vm.clearMockedCalls();
    }

    function test_constructorAcceptsEitherCurrencyOrderAndActuallySyncs() public {
        (PoolKey memory key, int24 lower, int24 upper, address requester) = factory.positionOf(LAUNCH);
        (key.currency0, key.currency1) = (key.currency1, key.currency0);
        vm.mockCall(
            address(factory), abi.encodeCall(IPoolFees.positionOf, (LAUNCH)), abi.encode(key, lower, upper, requester)
        );
        duelToken.transfer(address(vault), 1e18);
        assertEq(vault.totalSupply(), 0);
        IMDuelFeeRouter other = _deployRouter();
        assertEq(other.vault(), address(vault));
        assertEq(vault.balanceOf(vault.DEAD()), 1e18, "constructor must execute the vault's sync");
        assertEq(vault.reserve(), 0);
        vm.clearMockedCalls();
    }

    function test_constructorPropagatesSyncFailure() public {
        vm.mockCallRevert(
            address(vault), abi.encodeCall(ISync.sync, ()), abi.encodeWithSelector(DependencyFailure.selector)
        );
        vm.expectRevert(DependencyFailure.selector);
        _deployRouter();
        vm.clearMockedCalls();
    }
}
