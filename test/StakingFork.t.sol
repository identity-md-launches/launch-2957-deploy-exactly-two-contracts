// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolSwapTest} from "v4-core/src/test/PoolSwapTest.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {Currency} from "v4-core/src/types/Currency.sol";
import {SwapParams} from "v4-core/src/types/PoolOperation.sol";
import {IMDuelStaking} from "../src/IMDuelStaking.sol";
import {IMDuelFeeRouter, IPoolFees} from "../src/IMDuelFeeRouter.sol";

/// The staking release rehearsed against the live contracts on a mainnet fork (launch 2843): the vault and the fee
/// router deployed beside them; the launch wallet claims what has accrued, hands the requester to the router and sends
/// the 10M seed; a sync makes the dead stake; real main-duel trades earn fees; anyone collects; stakers come and go; a
/// handoff and a lock. Runs only with ETH_RPC set:
/// `ETH_RPC=https://gateway.tenderly.co/public/mainnet scripts/hook-test.sh --match-path test/StakingFork.t.sol -vv`.
contract StakingForkTest is Test {
    IPoolFees constant FACTORY = IPoolFees(0x12C63b581d07093F6126bc02263c58f7EadaA96F);
    IPoolManager constant MANAGER = IPoolManager(0x000000000004444c5dc75cB358380D2e3dE08A90);
    IERC20 constant IMDUEL = IERC20(0xc012b8Db13C57beCd950eEfB70540e6f973A3C73);
    IERC20 constant IMD = IERC20(0xD34a99Bc0f67aE1bbd63C660e6d0b0dd03E263B7);
    address constant HOOK = 0xA92F72DcDd90229C32F6d51229F4cc5c916410CC;
    address constant LAUNCH_WALLET = 0x6AA302EFf055259c9Cf177f33Ae3cBA5d4135B23;
    address constant DEAD = 0x000000000000000000000000000000000000dEaD;
    uint64 constant LAUNCH = 2843;
    uint256 constant SEED = 10_000_000e18;
    uint256 constant TEAM_STAKE = 1_000_000e18;

    bool live;
    IMDuelStaking vault;
    IMDuelFeeRouter router;
    PoolSwapTest swapper;
    PoolKey key;
    address team = makeAddr("team");
    address admin = makeAddr("admin"); // a key of its own, not the team wallet
    address trader = makeAddr("trader");
    address staker = makeAddr("staker");
    address stranger = makeAddr("stranger");
    uint256 now_;

    function setUp() public {
        string memory rpc = vm.envOr("ETH_RPC", string(""));
        if (bytes(rpc).length == 0) return;
        live = true;
        vm.createSelectFork(rpc);
        now_ = block.timestamp;
        vault = new IMDuelStaking(IMDUEL);
        router = new IMDuelFeeRouter(FACTORY, LAUNCH, IMDUEL, IMD, address(vault), team, admin);
        swapper = new PoolSwapTest(MANAGER);
        address requester;
        (key,,, requester) = FACTORY.positionOf(LAUNCH);
        assertEq(requester, LAUNCH_WALLET, "the launch wallet is the requester today");
        assertEq(address(key.hooks), HOOK, "launch 2843's position is the main duel");
    }

    function _wait(uint256 seconds_) internal {
        now_ += seconds_;
        vm.warp(now_);
        vm.roll(block.number + seconds_ / 12 + 1);
    }

    /// The launch order: 1 $IMDUEL and a sync make the dead stake with nothing to release;
    /// the team stakes; then the seed and a sync; then the accrued fees are claimed (they stay the team's) and the
    /// requester is handed to the router.
    function _release() internal returns (uint256 keptIMD, uint256 keptIMDUEL) {
        vm.startPrank(LAUNCH_WALLET);
        IMDUEL.transfer(address(vault), 1e18);
        vault.sync();
        IMDUEL.approve(address(vault), TEAM_STAKE);
        vault.deposit(TEAM_STAKE, LAUNCH_WALLET);
        IMDUEL.transfer(address(vault), SEED);
        vault.sync();
        vm.stopPrank();
        uint256 imd0 = IMD.balanceOf(LAUNCH_WALLET);
        uint256 imduel0 = IMDUEL.balanceOf(LAUNCH_WALLET);
        vm.prank(stranger);
        FACTORY.claimFees(LAUNCH);
        keptIMD = IMD.balanceOf(LAUNCH_WALLET) - imd0;
        keptIMDUEL = IMDUEL.balanceOf(LAUNCH_WALLET) - imduel0;
        vm.prank(LAUNCH_WALLET);
        FACTORY.setRequester(LAUNCH, address(router));
    }

    /// A buy and a sell on the main duel, paid from the launch wallet's tokens; a queued move may play.
    function _trade(uint256 imdIn, uint256 imduelIn) internal {
        vm.startPrank(LAUNCH_WALLET);
        IMD.transfer(trader, imdIn);
        IMDUEL.transfer(trader, imduelIn);
        vm.stopPrank();
        vm.startPrank(trader);
        IMD.approve(address(swapper), imdIn);
        IMDUEL.approve(address(swapper), imduelIn);
        PoolSwapTest.TestSettings memory settings = PoolSwapTest.TestSettings({takeClaims: false, settleUsingBurn: false});
        swapper.swap(
            key,
            SwapParams({zeroForOne: false, amountSpecified: -int256(imdIn), sqrtPriceLimitX96: TickMath.MAX_SQRT_PRICE - 1}),
            settings,
            abi.encodePacked(trader)
        );
        _wait(12);
        swapper.swap(
            key,
            SwapParams({zeroForOne: true, amountSpecified: -int256(imduelIn), sqrtPriceLimitX96: TickMath.MIN_SQRT_PRICE + 1}),
            settings,
            abi.encodePacked(trader)
        );
        vm.stopPrank();
        _wait(12);
    }

    function test_theWholeRelease() public {
        if (!live) return;
        (uint256 keptIMD, uint256 keptIMDUEL) = _release();
        emit log_named_decimal_uint("accrued before the handoff, kept by the launch wallet: IMD", keptIMD, 18);
        emit log_named_decimal_uint("  and IMDUEL", keptIMDUEL, 18);
        (,,, address requester) = FACTORY.positionOf(LAUNCH);
        assertEq(requester, address(router));
        assertEq(vault.balanceOf(DEAD), 1e18, "the dead stake, 1 $IMDUEL");
        assertEq(vault.reserve(), SEED, "the seed is the reserve");
        assertEq(vault.totalAssets(), TEAM_STAKE + 1e18, "the team and the dead stake, before anything is released");

        // fees from real trades: 1.25% of each input to the position, 80% of it the requester's (1% of the trade)
        _trade(1e18, 300_000e18);
        uint256 reserve = vault.reserve();
        uint256 g = gasleft();
        vm.prank(stranger);
        (uint256 toVault, uint256 toTeam) = router.collect();
        emit log_named_uint("gas: collect through the real factory", g - gasleft());
        emit log_named_decimal_uint("collected to the vault: IMDUEL", toVault, 18);
        emit log_named_decimal_uint("collected to the team: IMD", toTeam, 18);
        assertApproxEqRel(toTeam, 1e18 / 100, 0.25e18, "about 1% of the IMD bought with");
        assertApproxEqRel(toVault, 300_000e18 / 100, 0.25e18, "about 1% of the IMDUEL sold");
        assertEq(IMD.balanceOf(team), toTeam);
        assertEq(vault.reserve(), reserve + toVault, "the fee joins the reserve");
        assertEq(IMD.balanceOf(address(router)) + IMDUEL.balanceOf(address(router)), 0);

        // a staker in and out on the live token
        vm.prank(LAUNCH_WALLET);
        IMDUEL.transfer(staker, 1_000_000e18);
        vm.startPrank(staker);
        IMDUEL.approve(address(vault), 1_000_000e18);
        uint256 shares = vault.deposit(1_000_000e18, staker);
        vm.stopPrank();
        reserve = vault.reserve();
        uint256 all = vault.totalAssets(); // the team, the staker and the dead stake, when the day starts
        _wait(1 days);
        uint256 worth = vault.convertToAssets(shares);
        emit log_named_decimal_uint("a 1M stake after a day", worth, 18);
        assertApproxEqRel(worth - 1_000_000e18, reserve / 100 * 1_000_000e18 / all, 0.002e18, "its share of a day's 1%");
        vm.prank(staker);
        assertEq(vault.redeem(shares, staker, staker), worth);
        assertEq(IMDUEL.balanceOf(staker), worth);

        // with the team in, the dead stake's cut stays 1 / (all staked)
        uint256 deadWorth = vault.convertToAssets(vault.balanceOf(DEAD));
        assertLt(deadWorth, 1.2e18, "the dead stake is still worth about 1 $IMDUEL");
        assertEq(IMDUEL.balanceOf(address(vault)), vault.totalAssets() + vault.reserve());
    }

    function test_aHandoffAfterThreeDaysAndALock() public {
        if (!live) return;
        _release();
        address next = makeAddr("next");
        vm.prank(admin);
        router.propose(next);
        _trade(1e18, 100_000e18);
        _wait(3 days);
        vm.prank(admin);
        router.handOn();
        (,,, address requester) = FACTORY.positionOf(LAUNCH);
        assertEq(requester, next, "handed on");
        assertGt(IMD.balanceOf(team), 0, "the notice's fees went by the old split");

        // the next requester could be another router; this one is now inert
        IMDuelFeeRouter second = new IMDuelFeeRouter(FACTORY, LAUNCH, IMDUEL, IMD, address(vault), team, admin);
        vm.prank(next);
        FACTORY.setRequester(LAUNCH, address(second));
        vm.prank(admin);
        second.lock();
        _wait(30 days);
        vm.prank(admin);
        vm.expectRevert(IMDuelFeeRouter.NotAdmin.selector);
        second.propose(next);
        (,,, requester) = FACTORY.positionOf(LAUNCH);
        assertEq(requester, address(second), "locked in for good");
    }

    /// The router refuses a wrong launch against the live factory.
    function test_theRouterChecksItsWiringOnChain() public {
        if (!live) return;
        vm.expectRevert(IMDuelFeeRouter.InvalidSetup.selector);
        new IMDuelFeeRouter(FACTORY, LAUNCH - 1, IMDUEL, IMD, address(vault), team, admin);
    }
}
