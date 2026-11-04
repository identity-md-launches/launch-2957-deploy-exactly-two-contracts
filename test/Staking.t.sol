// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {IMDuelToken} from "../src/IMDuelToken.sol";
import {IMDuelStaking} from "../src/IMDuelStaking.sol";

/// One vault on $IMDUEL; the test contract holds the rest of the supply.
abstract contract StakingBase is Test {
    IMDuelToken token;
    IMDuelStaking vault;
    address constant DEAD = 0x000000000000000000000000000000000000dEaD;
    uint256 constant SEED = 10_000_000e18;
    uint256 constant DAY = 1 days;
    uint256 constant DEAD_SHARES = 1e18; // 1 $IMDUEL, 1:1 at the empty vault's rate
    uint256 now_ = 1_762_000_000; // the clock kept here: under via-IR a test's block.timestamp can read stale after a warp

    function setUp() public virtual {
        vm.warp(now_);
        token = new IMDuelToken();
        vault = new IMDuelStaking(IERC20(address(token)));
    }

    /// The release step: the seed sent as a plain transfer, then a sync, which stakes 1 $IMDUEL of it for 0x...dEaD.
    function _open(uint256 seed) internal {
        token.transfer(address(vault), seed);
        vault.sync();
    }

    function _stake(address who, uint256 amount) internal returns (uint256 shares) {
        token.transfer(who, amount);
        vm.startPrank(who);
        token.approve(address(vault), amount);
        shares = vault.deposit(amount, who);
        vm.stopPrank();
    }

    function _leave(address who) internal returns (uint256) {
        uint256 shares = vault.balanceOf(who);
        vm.prank(who);
        return vault.redeem(shares, who, who);
    }

    function _value(address who) internal view returns (uint256) {
        return vault.convertToAssets(vault.balanceOf(who));
    }

    function _wait(uint256 seconds_) internal {
        now_ += seconds_;
        vm.warp(now_);
    }
}

contract StakingTest is StakingBase {
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    address carol = makeAddr("carol");

    // ── Opening ──

    function test_closedUntilTheDeadStakeAndNothingReleasedBefore() public {
        assertEq(vault.maxDeposit(alice), 0);
        assertEq(vault.maxMint(alice), 0);
        token.transfer(alice, 1e18);
        vm.startPrank(alice);
        token.approve(address(vault), 1e18);
        vm.expectRevert(abi.encodeWithSelector(ERC4626.ERC4626ExceededMaxDeposit.selector, alice, 1e18, 0));
        vault.deposit(1e18, alice);
        vm.stopPrank();

        token.transfer(address(vault), 0.5e18);
        vault.sync(); // under DEAD_ASSETS: still closed
        assertEq(vault.totalSupply(), 0);
        token.transfer(address(vault), SEED);
        _wait(30 * DAY);
        assertEq(vault.reserve(), SEED + 0.5e18, "nothing is released into an empty vault");
        vault.sync();
        assertEq(vault.balanceOf(DEAD), DEAD_SHARES, "the dead stake");
        assertEq(vault.totalSupply(), DEAD_SHARES);
        assertEq(vault.totalAssets(), 1e18);
        assertEq(vault.reserve(), SEED + 0.5e18 - 1e18);
        assertEq(vault.maxDeposit(alice), type(uint256).max);
        vault.sync();
        assertEq(vault.balanceOf(DEAD), DEAD_SHARES, "made once");
    }

    function test_theTokenIsStandard() public {
        assertEq(vault.name(), "Staked IMDuel");
        assertEq(vault.symbol(), "sIMDUEL");
        assertEq(vault.decimals(), 18);
        assertEq(vault.asset(), address(token));
        _open(SEED);
        uint256 shares = _stake(alice, 1_000e18);
        assertEq(shares, 1_000e18, "1 $IMDUEL = 1 sIMDUEL at the start");
    }

    // ── The release ──

    function test_releaseScalesThePerSecondRateByRedeemableShares() public {
        _open(SEED);
        _stake(alice, 1e18); // half of the shares can redeem: half of the base per-second rate
        uint256 expected = SEED - 1e18;
        // Independently evaluated with 80-digit decimal arithmetic: (1 - (1 - KEEP) / 2)^86400, in 1e27.
        uint256 dailyKeep = 994987437252023507328880933;
        for (uint256 d = 1; d <= 30; d++) {
            _wait(DAY);
            expected = expected * dailyKeep / 1e27;
            assertApproxEqRel(vault.reserve(), expected, 1e3, "scaled rate, compounded"); // within 1e-15
        }
        assertEq(vault.totalAssets() + vault.reserve(), SEED + 1e18, "released into the stake, nowhere else");
    }

    function test_theReleaseDependsOnlyOnTime() public {
        IMDuelStaking once = new IMDuelStaking(IERC20(address(token)));
        token.transfer(address(once), SEED);
        once.sync();
        _open(SEED);
        _stake(alice, 1e18);
        token.approve(address(once), 1e18);
        once.deposit(1e18, alice);
        for (uint256 i; i < 24 * 7; i++) {
            _wait(1 hours - 7);
            vault.sync();
        }
        _wait(24 * 7 * 7);
        vault.sync();
        assertApproxEqAbs(vault.reserve(), once.reserve(), 1e6, "hourly or weekly: the same release");
    }

    function testFuzz_theReleaseDependsOnlyOnTime(uint256 a, uint256 b) public {
        a = bound(a, 0, 3_650 days);
        b = bound(b, 0, 3_650 days);
        IMDuelStaking once = new IMDuelStaking(IERC20(address(token)));
        token.transfer(address(once), SEED);
        once.sync();
        _open(SEED);
        _stake(alice, 1e18);
        token.approve(address(once), 1e18);
        once.deposit(1e18, alice);
        _wait(a);
        vault.sync();
        uint256 middle = vault.reserve();
        _wait(b);
        assertApproxEqAbs(vault.reserve(), once.reserve(), 1e3, "two steps or one");
        assertLe(vault.reserve(), middle);
        assertEq(vault.totalAssets() + vault.reserve(), SEED + 1e18);
    }

    /// The swarm audit's first low (job d944c9f4): the dead stake alone is paid nothing; the reserve waits, and the
    /// first staker earns from when they stake, not the wait before.
    function test_theReserveWaitsWhileTheDeadStakeIsAlone() public {
        _open(SEED);
        _wait(DAY);
        assertEq(vault.totalAssets(), 1e18, "nothing released to the dead stake alone");
        assertEq(vault.reserve(), SEED - 1e18, "the reserve waits");
        _stake(alice, 1_000_000e18);
        assertApproxEqRel(_value(alice), 1_000_000e18, 1e9, "no backlog for the first staker");
        _wait(DAY);
        uint256 release = SEED - 1e18 - vault.reserve();
        assertApproxEqRel(release, (SEED - 1e18) / 100, 1e12, "near the base rate with a million tokens staked");
        assertApproxEqRel(_value(alice) - 1_000_000e18, release * 1e6 / (1e6 + 1), 1e9, "her share of the release");
    }

    /// Everyone but the dead stake leaves: the reserve waits again (the audit's state b, seven days).
    function test_theReserveWaitsWhenEveryStakerLeaves() public {
        _open(SEED);
        _stake(alice, 1_000_000e18);
        _wait(DAY);
        _leave(alice);
        uint256 reserve = vault.reserve();
        uint256 dead = _value(DEAD);
        _wait(7 * DAY);
        assertEq(vault.reserve(), reserve, "nothing released while nobody redeemable is staked");
        assertEq(_value(DEAD), dead);
    }

    /// Settle before the transfer: the accrued release stays, then the reserve waits while nobody can redeem.
    function test_sharesSentToDeadSettleThenStopTheRelease() public {
        _open(SEED);
        _stake(alice, 1_000_000e18);
        _wait(DAY);
        uint256 price = vault.convertToAssets(1e18);
        uint256 shares = vault.balanceOf(alice);
        vm.prank(alice);
        vault.transfer(DEAD, shares);
        assertEq(vault.convertToAssets(1e18), price, "the same worth after the transfer");
        uint256 reserve = vault.reserve();
        _wait(DAY);
        assertEq(vault.convertToAssets(1e18), price, "no release to the dead stake alone");
        assertEq(vault.reserve(), reserve);
    }

    // ── Stakers ──

    function test_stakersShareTheReleaseByTheirShare() public {
        _open(SEED);
        _stake(alice, 3_000_000e18);
        _stake(bob, 1_000_000e18);
        uint256 reserve = vault.reserve();
        _wait(DAY);
        uint256 release = reserve - vault.reserve();
        assertApproxEqRel(release, reserve / 100, 1e12, "near the base rate with four million tokens staked");
        uint256 all = 4_000_000e18 + 1e18;
        assertApproxEqRel(_value(alice) - 3_000_000e18, release * 3_000_000e18 / all, 1e9);
        assertApproxEqRel(_value(bob) - 1_000_000e18, release * 1_000_000e18 / all, 1e9);
        assertLt(_value(DEAD) - 1e18, release / 1e6, "the dead stake's cut: 1 / (all staked)");
    }

    function test_aStakeGrowsEverySecondWithNothingToClaim() public {
        _open(SEED);
        _stake(alice, 1_000_000e18);
        uint256 last = _value(alice);
        for (uint256 i; i < 48; i++) {
            _wait(1 hours);
            uint256 v = _value(alice);
            assertGt(v, last);
            last = v;
        }
        // the release compounds: the second day pays the first day's earnings too, on a reserve 1% smaller
        uint256 r = SEED - 1e18;
        assertApproxEqRel(last, 1_000_000e18 + r / 100 + r * 99 / 100 / 100, 1e12);
        assertApproxEqAbs(_leave(alice), last, 1, "leave with everything, no fee");
    }

    function test_rewardsFollowTimeStaked() public {
        _open(SEED);
        _stake(alice, 1_000_000e18);
        _wait(DAY);
        _stake(bob, 1_000_000e18);
        assertApproxEqAbs(_value(bob), 1_000_000e18, 1, "bob catches none of the first day");
        uint256 aliceAtBob = _value(alice);
        _wait(DAY);
        uint256 dayTwoBob = _value(bob) - 1_000_000e18;
        assertApproxEqRel(_value(alice) - aliceAtBob, dayTwoBob * aliceAtBob / 1_000_000e18, 1e12);
    }

    function test_aTopUpJoinsTheReserveWithoutJumpingAStake() public {
        _open(SEED);
        _stake(alice, 1_000_000e18);
        _wait(DAY);
        uint256 before = _value(alice);
        uint256 reserve = vault.reserve();
        token.transfer(address(vault), 5_000_000e18);
        assertEq(_value(alice), before, "a top-up raises only what comes later");
        assertEq(vault.reserve(), reserve + 5_000_000e18);
        vault.sync(); // a top-up starts releasing at the next action (the router syncs after forwarding)
        _wait(DAY);
        // The new reserve releases at the scaled rate, and every share gets the same fraction of that release.
        uint256 release = reserve + 5_000_000e18 - vault.reserve();
        assertApproxEqRel(release, (reserve + 5_000_000e18) / 100, 1e12);
        assertApproxEqRel(_value(alice) - before, release * 1e6 / (1e6 + 1), 1e9);
    }

    /// The classic donation attack has nothing to work on: a plain transfer never touches what a share is worth.
    function test_aDonationNeverMovesTheSharePrice() public {
        _open(SEED);
        _stake(alice, 1e18);
        uint256 price = vault.convertToAssets(1e18);
        token.transfer(address(vault), 100_000_000e18);
        assertEq(vault.convertToAssets(1e18), price);
    }

    function test_theDeadStakeIsForever() public {
        _open(SEED);
        _stake(alice, 1_000e18);
        _leave(alice);
        assertEq(vault.totalSupply(), DEAD_SHARES, "everyone else gone: the dead stake remains");
        vm.prank(alice);
        vm.expectRevert();
        vault.redeem(DEAD_SHARES, alice, DEAD); // no allowance from 0x...dEaD, ever
        _stake(bob, 1_000e18);
        assertApproxEqRel(_value(bob), 1_000e18, 1e9, "the vault reopens at the dead stake's price");
    }

    // ── ERC-4626 conformance ──

    function test_previewsMatchWhatHappens() public {
        _open(SEED);
        _stake(alice, 3_333e18 + 7);
        _wait(5 * DAY + 13);
        token.transfer(bob, 10_000e18);
        vm.startPrank(bob);
        token.approve(address(vault), type(uint256).max);
        uint256 p = vault.previewDeposit(1_234e18 + 1);
        assertEq(vault.deposit(1_234e18 + 1, bob), p, "deposit");
        p = vault.previewMint(7e18 + 3);
        uint256 before = token.balanceOf(bob);
        assertEq(vault.mint(7e18 + 3, bob), p, "mint");
        assertEq(before - token.balanceOf(bob), p);
        p = vault.previewWithdraw(500e18 + 9);
        assertEq(vault.withdraw(500e18 + 9, bob, bob), p, "withdraw");
        p = vault.previewRedeem(vault.balanceOf(bob));
        assertEq(vault.maxWithdraw(bob), p);
        assertEq(vault.redeem(vault.balanceOf(bob), bob, bob), p, "redeem");
        vm.stopPrank();
    }

    function test_stakeForAnotherAndLeaveWithAnApproval() public {
        _open(SEED);
        token.transfer(alice, 1_000e18);
        vm.startPrank(alice);
        token.approve(address(vault), 1_000e18);
        uint256 shares = vault.deposit(1_000e18, bob);
        vm.stopPrank();
        assertEq(vault.balanceOf(bob), shares);
        assertEq(vault.balanceOf(alice), 0);
        vm.prank(alice);
        vm.expectRevert();
        vault.redeem(shares, alice, bob); // the shares are bob's
        vm.prank(bob);
        vault.approve(carol, shares);
        vm.prank(carol);
        vault.redeem(shares, carol, bob);
        assertApproxEqAbs(token.balanceOf(carol), 1_000e18, 1);
    }

    // ── Attacks ──

    /// A lone dust stake beside the dead one, held for a year and withdrawn down every day: a later deposit still
    /// mints at a sane price and loses no more than dust.
    function test_aLoneDustStakeCannotInflateAShare() public {
        _open(SEED);
        _stake(alice, 1);
        for (uint256 d; d < 365; d++) {
            _wait(DAY);
            uint256 held = vault.balanceOf(alice);
            if (held > 1) {
                vm.prank(alice);
                vault.redeem(held - 1, alice, alice);
            }
        }
        assertLt(vault.convertToAssets(1), 1e10, "one share unit is worth under a hundred-millionth of a token");
        uint256 shares = _stake(bob, 1_000e18);
        assertGt(shares, 0);
        vm.prank(bob);
        assertGe(vault.redeem(shares, bob, bob), 1_000e18 - 1e10);
    }

    /// The audit's M-1: deposit just under two shares' worth, leave with one, repeat. The dead stake's 1e18 shares
    /// make each round move the price by a vanishing amount.
    function test_theRoundingPumpGoesNowhere() public {
        _open(SEED);
        _wait(30 * DAY);
        token.transfer(alice, 1_000e18);
        vm.startPrank(alice);
        token.approve(address(vault), type(uint256).max);
        vault.deposit(1, alice);
        uint256 price = vault.convertToAssets(1e18);
        for (uint256 i; i < 150; i++) {
            uint256 p = vault.convertToAssets(1) + 1;
            uint256 got = vault.deposit(2 * p - 1, alice);
            if (got > 0) vault.redeem(got, alice, alice);
        }
        vm.stopPrank();
        assertApproxEqRel(vault.convertToAssets(1e18), price, 1e6, "the price barely moves"); // within 1e-12
    }

    function testFuzz_aRoundTripNeverProfits(uint256 prior, uint256 waited, uint256 amount) public {
        prior = bound(prior, 1, 100_000_000e18);
        amount = bound(amount, 1, 100_000_000e18);
        _open(SEED);
        _stake(alice, prior);
        _wait(bound(waited, 0, 400 days));
        uint256 shares = _stake(bob, amount);
        vm.assume(shares > 0);
        vm.prank(bob);
        uint256 out = vault.redeem(shares, bob, bob);
        assertLe(out, amount, "never more than put in");
        assertLe(amount - out, 1e10, "at most dust lost");
    }

    /// Measured with --isolate.
    function test_budgets() public {
        assertLt(address(vault).code.length, 9_000, "runtime bytes");
        _open(SEED);
        _stake(bob, 1e24);
        token.transfer(alice, 2e24);
        vm.startPrank(alice);
        token.approve(address(vault), type(uint256).max);
        _wait(1 hours);
        uint256 g = gasleft();
        uint256 shares = vault.deposit(1e24, alice);
        assertLt(g - gasleft(), 110_000, "a first stake");
        _wait(1 hours);
        g = gasleft();
        vault.deposit(1e24, alice);
        assertLt(g - gasleft(), 80_000, "a later stake"); // forge 1.8.3 measures 73,354 (swarm audit d944c9f4)
        g = gasleft();
        vault.transfer(bob, 1e18);
        assertLt(g - gasleft(), 40_000, "moving shares");
        _wait(1 hours);
        g = gasleft();
        vault.redeem(shares, alice, alice);
        assertLt(g - gasleft(), 95_000, "leaving"); // 92,084 with the dead-balance read and scaled rate (audit 836357b2)
        vm.stopPrank();
    }
}

/// Random stakes, mints, withdrawals, redemptions (for others too), share transfers (to 0x...dEaD too), top-ups and
/// waits up to four years; every action must succeed.
contract StakingHandler is Test {
    IMDuelToken token;
    IMDuelStaking vault;
    address constant DEAD = 0x000000000000000000000000000000000000dEaD;
    address[4] public actors = [address(0xA1), address(0xA2), address(0xA3), address(0xA4)];
    uint256 now_ = block.timestamp;
    uint256 public lastPrice; // (totalAssets + 1) / (totalSupply + 1), in 1e36, which may never fall

    constructor(IMDuelToken token_, IMDuelStaking vault_) {
        (token, vault) = (token_, vault_);
        for (uint256 i; i < actors.length; i++) {
            vm.prank(actors[i]);
            token.approve(address(vault), type(uint256).max);
        }
    }

    function deposit(uint8 who, uint8 to, uint256 amount) external {
        address a = actors[who % 4];
        amount = bound(amount, 0, token.balanceOf(a));
        vm.prank(a);
        vault.deposit(amount, actors[to % 4]);
        _checkPrice();
    }

    function mint(uint8 who, uint256 shares) external {
        address a = actors[who % 4];
        shares = bound(shares, 0, vault.convertToShares(token.balanceOf(a)) / 2);
        vm.prank(a);
        vault.mint(shares, a);
        _checkPrice();
    }

    function withdraw(uint8 who, uint8 to, uint256 amount) external {
        address a = actors[who % 4];
        amount = bound(amount, 0, vault.maxWithdraw(a));
        vm.prank(a);
        vault.withdraw(amount, actors[to % 4], a);
        _checkPrice();
    }

    function redeem(uint8 who, uint256 shares) external {
        address a = actors[who % 4];
        shares = bound(shares, 0, vault.balanceOf(a));
        vm.prank(a);
        vault.redeem(shares, a, a);
        _checkPrice();
    }

    function move(uint8 from, uint8 to, uint256 shares) external {
        address a = actors[from % 4];
        shares = bound(shares, 0, vault.balanceOf(a));
        vm.prank(a);
        vault.transfer(to % 5 == 4 ? DEAD : actors[to % 4], shares);
    }

    function topUp(uint256 amount, bool sync) external {
        amount = bound(amount, 0, token.balanceOf(address(this)) / 10);
        token.transfer(address(vault), amount);
        if (sync) vault.sync();
        _checkPrice();
    }

    function wait(uint256 seconds_) external {
        now_ += bound(seconds_, 1, 4 * 365 days);
        vm.warp(now_);
        _checkPrice();
    }

    function _checkPrice() internal {
        uint256 p = (vault.totalAssets() + 1) * 1e36 / (vault.totalSupply() + 1);
        assertGe(p, lastPrice, "a share's worth never falls");
        lastPrice = p;
    }
}

/// forge-config: default.invariant.fail-on-revert = true
contract StakingInvariantTest is StakingBase {
    StakingHandler handler;

    function setUp() public override {
        super.setUp();
        handler = new StakingHandler(token, vault);
        token.transfer(address(handler), 300_000_000e18);
        for (uint256 i; i < 4; i++) {
            token.transfer(handler.actors(i), 100_000_000e18);
        }
        _open(SEED);
        targetContract(address(handler));
    }

    /// Everything the vault holds is what the shares are worth plus the reserve; no $IMDUEL appears or disappears.
    function invariant_everyWeiIsAccountedFor() public view {
        assertEq(token.balanceOf(address(vault)), vault.totalAssets() + vault.reserve());
        uint256 sum = token.balanceOf(address(this)) + token.balanceOf(address(handler))
            + token.balanceOf(address(vault)) + token.balanceOf(DEAD);
        for (uint256 i; i < 4; i++) {
            sum += token.balanceOf(handler.actors(i));
        }
        assertEq(sum, token.totalSupply());
    }

    function invariant_theDeadStakeNeverLeaves() public view {
        assertGe(vault.balanceOf(DEAD), DEAD_SHARES);
    }

    /// Every holder can leave with what its shares are worth, one after another, and only 0x...dEaD's shares stay.
    function invariant_everyoneCanLeave() public {
        for (uint256 i; i < 4; i++) {
            address a = handler.actors(i);
            uint256 shares = vault.balanceOf(a);
            if (shares == 0) continue;
            uint256 worth = vault.previewRedeem(shares);
            vm.prank(a);
            assertEq(vault.redeem(shares, a, a), worth);
        }
        assertEq(vault.totalSupply(), vault.balanceOf(DEAD), "only the dead stake is left");
    }
}
