// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {RouterChecksBase} from "./FeeRouterAdversarial.t.sol";
import {FakePoolFees} from "./FeeRouter.t.sol";
import {IMDuelToken} from "src/IMDuelToken.sol";
import {IMDuelStaking} from "src/IMDuelStaking.sol";
import {IMDuelFeeRouter} from "src/IMDuelFeeRouter.sol";

/// A closed set of token holders and an independent cash-flow/governance ledger.
/// No tokens are minted or dealt during a sequence. Accrual is funded before the factory can pay it.
contract FeeRouterSequenceHandler is Test {
    uint64 private constant LAUNCH = 2843;
    uint256 private constant NOTICE = 3 days;
    IMDuelToken public immutable duelToken;
    IMDuelToken public immutable feeToken;
    IMDuelStaking public immutable vault;
    IMDuelFeeRouter public immutable router;
    FakePoolFees public immutable factory;
    address public immutable originalAdmin;
    address public immutable successor;
    address public immutable team;
    address[3] public actors;

    address public expectedAdmin;
    address public expectedPending;
    address public expectedRequester;
    uint256 public expectedReadyAt;
    uint256 public clock;
    uint256 public lastPrice;

    uint256 public fundedDuel;
    uint256 public fundedIMD;
    uint256 public queuedDuel;
    uint256 public queuedIMD;
    uint256 public heldDuel;
    uint256 public heldIMD;
    uint256 public forwardedDuel;
    uint256 public forwardedIMD;
    uint256 public successorDuel;
    uint256 public successorIMD;
    uint256 public donatedToVault;
    uint256 public deposited;
    uint256 public withdrawn;
    uint256 public successfulCollects;
    uint256 public successfulHandoffs;

    constructor(IMDuelToken a, IMDuelToken b, IMDuelStaking v, IMDuelFeeRouter r, FakePoolFees f, address next) {
        duelToken = a;
        feeToken = b;
        vault = v;
        router = r;
        factory = f;
        originalAdmin = r.admin();
        expectedAdmin = r.admin();
        expectedRequester = address(r);
        successor = next;
        team = r.team();
        clock = block.timestamp;
        actors[0] = makeAddr("sequence alice");
        actors[1] = makeAddr("sequence bob");
        actors[2] = makeAddr("sequence carol");
        for (uint256 i; i < actors.length; ++i) {
            vm.prank(actors[i]);
            a.approve(address(v), type(uint256).max);
        }
        lastPrice = (v.totalAssets() + 1) * 1e36 / (v.totalSupply() + 1);
    }

    modifier checkPrice() {
        _;
        uint256 price = (vault.totalAssets() + 1) * 1e36 / (vault.totalSupply() + 1);
        assertGe(price, lastPrice, "staking share price decreased");
        lastPrice = price;
    }

    function accrue(uint256 a, uint256 b) external checkPrice {
        a = bound(a, 0, _min(duelToken.balanceOf(address(this)), 1e24));
        b = bound(b, 0, _min(feeToken.balanceOf(address(this)), 1e24));
        duelToken.transfer(address(factory), a);
        feeToken.transfer(address(factory), b);
        factory.accrue(a, b);
        fundedDuel += a;
        fundedIMD += b;
        queuedDuel += a;
        queuedIMD += b;
    }

    function donate(uint256 a, uint256 b, bool directToVault) external checkPrice {
        a = bound(a, 0, _min(duelToken.balanceOf(address(this)), 1e24));
        b = bound(b, 0, _min(feeToken.balanceOf(address(this)), 1e24));
        uint256 assetsBefore = vault.totalAssets();
        if (directToVault) {
            duelToken.transfer(address(vault), a);
            donatedToVault += a;
        } else {
            duelToken.transfer(address(router), a);
            heldDuel += a;
            fundedDuel += a;
        }
        feeToken.transfer(address(router), b);
        heldIMD += b;
        fundedIMD += b;
        assertEq(vault.totalAssets(), assetsBefore, "donations must not instantly inflate shares");
    }

    function directClaim(uint8 who) external checkPrice {
        vm.prank(actors[who % 3]);
        (uint256 a, uint256 b) = factory.claimFees(LAUNCH);
        assertEq(a, queuedDuel);
        assertEq(b, queuedIMD);
        _recordClaim();
    }

    function collect(uint8 who) external checkPrice {
        uint256 expectedDuel = heldDuel + (expectedRequester == address(router) ? queuedDuel : 0);
        uint256 expectedIMD = heldIMD + (expectedRequester == address(router) ? queuedIMD : 0);
        vm.prank(actors[who % 3]);
        (uint256 a, uint256 b) = router.collect();
        assertEq(a, expectedDuel, "collect must sweep the whole IMDUEL balance");
        assertEq(b, expectedIMD, "collect must sweep the whole IMD balance");
        _recordCollect();
    }

    function propose(uint8 caller, uint8 destination) external checkPrice {
        address sender = caller % 4 == 0 ? originalAdmin : actors[caller % 3];
        address next = destination % 4 == 0
            ? address(0)
            : destination % 4 == 1 ? successor : destination % 4 == 2 ? address(router) : address(vault);
        if (sender != expectedAdmin) {
            vm.prank(sender);
            vm.expectRevert(IMDuelFeeRouter.NotAdmin.selector);
            router.propose(next);
        } else if (next == address(vault)) {
            vm.prank(sender);
            vm.expectRevert(IMDuelFeeRouter.InvalidSetup.selector);
            router.propose(next);
        } else {
            vm.prank(sender);
            router.propose(next);
            expectedPending = next;
            expectedReadyAt = next == address(0) ? 0 : clock + NOTICE;
        }
    }

    function handOn(uint8 caller) external checkPrice {
        address sender = caller % 4 == 0 ? originalAdmin : actors[caller % 3];
        if (sender != expectedAdmin) {
            vm.prank(sender);
            vm.expectRevert(IMDuelFeeRouter.NotAdmin.selector);
            router.handOn();
        } else if (expectedPending == address(0) || clock < expectedReadyAt) {
            vm.prank(sender);
            vm.expectRevert(IMDuelFeeRouter.NotReady.selector);
            router.handOn();
        } else if (clock > expectedReadyAt + NOTICE) {
            vm.prank(sender);
            vm.expectRevert(IMDuelFeeRouter.Expired.selector);
            router.handOn();
        } else if (expectedRequester != address(router)) {
            // A router that already gave away its role cannot hand it on a second time.
            vm.prank(sender);
            vm.expectRevert(bytes("NotRequester"));
            router.handOn();
        } else {
            vm.prank(sender);
            router.handOn();
            _recordCollect();
            expectedRequester = expectedPending;
            expectedPending = address(0);
            expectedReadyAt = 0;
            successfulHandoffs++;
        }
    }

    function lock(uint8 caller) external checkPrice {
        // Keep successful irreversible locks uncommon so sequences can also explore long handover histories.
        address sender = caller % 16 == 0 ? originalAdmin : actors[caller % 3];
        if (sender != expectedAdmin) {
            vm.prank(sender);
            vm.expectRevert(IMDuelFeeRouter.NotAdmin.selector);
            router.lock();
        } else {
            vm.prank(sender);
            router.lock();
            expectedAdmin = address(0);
            expectedPending = address(0);
            expectedReadyAt = 0;
        }
    }

    function elapse(uint256 elapsed) external checkPrice {
        uint256 reserveBefore = vault.reserve();
        uint256 assetsBefore = vault.totalAssets();
        bool onlyDead = vault.totalSupply() == vault.balanceOf(vault.DEAD());
        clock += bound(elapsed, 0, 9 days);
        vm.warp(clock);
        if (onlyDead) {
            assertEq(vault.reserve(), reserveBefore, "dead-only periods must not release rewards");
            assertEq(vault.totalAssets(), assetsBefore);
        }
    }

    function noticeBoundary(uint8 edge) external checkPrice {
        if (expectedReadyAt == 0) return;
        uint256 at = edge % 4 == 0
            ? expectedReadyAt - 1
            : edge % 4 == 1 ? expectedReadyAt : edge % 4 == 2 ? expectedReadyAt + NOTICE : expectedReadyAt + NOTICE + 1;
        if (at > clock) {
            clock = at;
            vm.warp(clock);
        }
    }

    function stake(uint8 payer, uint8 receiver, uint256 amount, bool mintShares) external checkPrice {
        address from = actors[payer % 3];
        address to = actors[receiver % 3];
        uint256 available = duelToken.balanceOf(from);
        if (mintShares) {
            uint256 shares = bound(amount, 0, vault.convertToShares(available) / 2);
            uint256 assets = vault.previewMint(shares);
            vm.prank(from);
            assertEq(vault.mint(shares, to), assets);
            deposited += assets;
        } else {
            amount = bound(amount, 0, available);
            uint256 shares = vault.previewDeposit(amount);
            vm.prank(from);
            assertEq(vault.deposit(amount, to), shares);
            deposited += amount;
        }
    }

    function exit(uint8 owner, uint8 receiver, uint256 amount, bool withdrawAssets) external checkPrice {
        address from = actors[owner % 3];
        address to = actors[receiver % 3];
        if (withdrawAssets) {
            amount = bound(amount, 0, vault.maxWithdraw(from));
            uint256 shares = vault.previewWithdraw(amount);
            vm.prank(from);
            assertEq(vault.withdraw(amount, to, from), shares);
            withdrawn += amount;
        } else {
            amount = bound(amount, 0, vault.balanceOf(from));
            uint256 assets = vault.previewRedeem(amount);
            vm.prank(from);
            assertEq(vault.redeem(amount, to, from), assets);
            withdrawn += assets;
        }
    }

    function moveShares(uint8 owner, uint8 receiver, uint256 shares) external checkPrice {
        address from = actors[owner % 3];
        address to = receiver % 4 == 3 ? vault.DEAD() : actors[receiver % 3];
        shares = bound(shares, 0, vault.balanceOf(from));
        uint256 assetsBefore = vault.totalAssets();
        uint256 reserveBefore = vault.reserve();
        vm.prank(from);
        vault.transfer(to, shares);
        assertEq(vault.totalAssets(), assetsBefore, "moving shares cannot reprice elapsed rewards");
        assertEq(vault.reserve(), reserveBefore);
    }

    function roundTrip(uint8 who, uint256 amount) external checkPrice {
        address actor = actors[who % 3];
        uint256 before_ = duelToken.balanceOf(actor);
        uint256 sharesBefore = vault.balanceOf(actor);
        amount = bound(amount, 0, before_);
        vm.startPrank(actor);
        uint256 shares = vault.deposit(amount, actor);
        uint256 assets = vault.redeem(shares, actor, actor);
        vm.stopPrank();
        deposited += amount;
        withdrawn += assets;
        assertLe(duelToken.balanceOf(actor), before_, "same-timestamp round trip cannot profit");
        assertEq(vault.balanceOf(actor), sharesBefore);
    }

    function sync() external checkPrice {
        uint256 assets = vault.totalAssets();
        uint256 reserve = vault.reserve();
        uint256 supply = vault.totalSupply();
        vault.sync();
        vault.sync();
        assertEq(vault.totalAssets(), assets);
        assertEq(vault.reserve(), reserve);
        assertEq(vault.totalSupply(), supply);
    }

    function _recordClaim() private {
        if (expectedRequester == address(router)) {
            heldDuel += queuedDuel;
            heldIMD += queuedIMD;
        } else {
            successorDuel += queuedDuel;
            successorIMD += queuedIMD;
        }
        queuedDuel = 0;
        queuedIMD = 0;
    }

    function _recordCollect() private {
        _recordClaim();
        forwardedDuel += heldDuel;
        forwardedIMD += heldIMD;
        heldDuel = 0;
        heldIMD = 0;
        successfulCollects++;
    }

    function _min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }
}

/// forge-config: default.invariant.runs = 256
/// forge-config: default.invariant.depth = 128
/// forge-config: default.invariant.fail-on-revert = true
contract FeeRouterSequenceInvariantTest is RouterChecksBase {
    FeeRouterSequenceHandler internal handler;

    function setUp() public override {
        super.setUp();
        duelToken.transfer(address(vault), 1e18);
        vault.sync();
        handler = new FeeRouterSequenceHandler(duelToken, feeToken, vault, router, factory, successor);
        duelToken.transfer(address(handler), 100_000_000e18);
        feeToken.transfer(address(handler), 100_000_000e18);
        for (uint256 i; i < 3; ++i) {
            duelToken.transfer(handler.actors(i), 100_000_000e18);
        }
        bytes4[] memory selectors = new bytes4[](14);
        selectors[0] = handler.accrue.selector;
        selectors[1] = handler.donate.selector;
        selectors[2] = handler.directClaim.selector;
        selectors[3] = handler.collect.selector;
        selectors[4] = handler.propose.selector;
        selectors[5] = handler.handOn.selector;
        selectors[6] = handler.lock.selector;
        selectors[7] = handler.elapse.selector;
        selectors[8] = handler.noticeBoundary.selector;
        selectors[9] = handler.stake.selector;
        selectors[10] = handler.exit.selector;
        selectors[11] = handler.moveShares.selector;
        selectors[12] = handler.roundTrip.selector;
        selectors[13] = handler.sync.selector;
        targetContract(address(handler));
        targetSelector(FuzzSelector({addr: address(handler), selectors: selectors}));
    }

    function invariant_everyFeeHasExactlyOneDestination() public view {
        assertEq(duelToken.balanceOf(address(factory)), handler.queuedDuel());
        assertEq(feeToken.balanceOf(address(factory)), handler.queuedIMD());
        assertEq(duelToken.balanceOf(address(router)), handler.heldDuel());
        assertEq(feeToken.balanceOf(address(router)), handler.heldIMD());
        assertEq(feeToken.balanceOf(team), handler.forwardedIMD());
        assertEq(duelToken.balanceOf(successor), handler.successorDuel());
        assertEq(feeToken.balanceOf(successor), handler.successorIMD());
        assertEq(
            handler.fundedDuel(),
            handler.queuedDuel() + handler.heldDuel() + handler.forwardedDuel() + handler.successorDuel()
        );
        assertEq(
            handler.fundedIMD(),
            handler.queuedIMD() + handler.heldIMD() + handler.forwardedIMD() + handler.successorIMD()
        );
        assertEq(feeToken.balanceOf(address(vault)), 0, "IMD must never go to the staking vault");
        assertEq(duelToken.balanceOf(team), 0, "staking fees must never go to the team");
    }

    function invariant_vaultCashFlowAndShareBacking() public view {
        uint256 backing = duelToken.balanceOf(address(vault));
        assertEq(backing, vault.totalAssets() + vault.reserve());
        assertEq(
            backing + handler.withdrawn(),
            1e18 + handler.deposited() + handler.forwardedDuel() + handler.donatedToVault(),
            "cash-flow ledger must explain every asset held and paid out"
        );
        uint256 shares = vault.balanceOf(vault.DEAD());
        uint256 claims = vault.previewRedeem(shares);
        for (uint256 i; i < 3; ++i) {
            address actor = handler.actors(i);
            shares += vault.balanceOf(actor);
            claims += vault.maxWithdraw(actor);
        }
        assertEq(shares, vault.totalSupply());
        assertGe(vault.balanceOf(vault.DEAD()), 1e18);
        assertLe(claims, vault.totalAssets(), "reserve is not immediately redeemable");
        assertGt(vault.previewDeposit(1e18), 0, "a full token must not round to zero shares");
    }

    function invariant_governanceMatchesIndependentStateMachine() public view {
        assertEq(router.admin(), handler.expectedAdmin());
        assertEq(router.pending(), handler.expectedPending());
        assertEq(router.readyAt(), handler.expectedReadyAt());
        assertEq(factory.requester(LAUNCH), handler.expectedRequester());
        assertEq(router.NOTICE(), 3 days);
        assertEq(router.team(), team);
        assertEq(router.vault(), address(vault));
        assertEq(address(router.factory()), address(factory));
        if (handler.expectedAdmin() == address(0)) {
            assertEq(router.pending(), address(0));
            assertEq(router.readyAt(), 0);
        }
    }

    /// Liveness is checked without mutating the state between random handler calls.
    function afterInvariant() public {
        for (uint256 i; i < 3; ++i) {
            address actor = handler.actors(i);
            uint256 shares = vault.balanceOf(actor);
            uint256 expected = vault.previewRedeem(shares);
            uint256 before_ = duelToken.balanceOf(actor);
            vm.prank(actor);
            assertEq(vault.redeem(shares, actor, actor), expected);
            assertEq(duelToken.balanceOf(actor), before_ + expected);
        }
        assertEq(vault.totalSupply(), vault.balanceOf(vault.DEAD()));
        uint256 reserve = vault.reserve();
        vm.warp(handler.clock() + 365 days);
        vault.sync();
        assertEq(vault.reserve(), reserve, "the reserve must wait after all redeemable holders exit");
    }

    /// A deterministic non-vacuity check for the same handler used by the random campaign.
    function test_handlerTraversesHandoverFailureLockAndCollection() public {
        handler.accrue(10e18, 5e18);
        handler.directClaim(1);
        handler.donate(3e18, 2e18, false);
        handler.stake(0, 1, 2e18, false);
        handler.propose(0, 1);
        handler.noticeBoundary(0);
        handler.handOn(0); // too early
        handler.noticeBoundary(1);
        handler.handOn(0);
        assertEq(handler.successfulHandoffs(), 1);
        handler.accrue(7e18, 4e18);
        handler.donate(2e18, 1e18, false);
        handler.collect(2); // new fees go to the successor, donations still follow this router's split
        handler.propose(0, 2);
        handler.noticeBoundary(1);
        handler.handOn(0); // no longer the requester: the final collect must roll back
        handler.lock(0);
        handler.propose(0, 1); // permanently unauthorized
        handler.collect(0);
        assertEq(handler.successfulCollects(), 3);
        invariant_everyFeeHasExactlyOneDestination();
        invariant_vaultCashFlowAndShareBacking();
        invariant_governanceMatchesIndependentStateMachine();
        afterInvariant();
    }
}
