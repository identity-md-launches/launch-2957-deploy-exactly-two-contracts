// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {Currency} from "v4-core/src/types/Currency.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {IMDuelToken} from "../src/IMDuelToken.sol";
import {IMDuelStaking} from "../src/IMDuelStaking.sol";
import {IMDuelFeeRouter, IPoolFees} from "../src/IMDuelFeeRouter.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

/// A plain ERC-4626 on $IMDUEL, with no sync: the router must refuse it.
contract PlainVault is ERC4626 {
    constructor(IERC20 asset_) ERC4626(asset_) ERC20("Plain", "P") {}
}

/// The factory's fee rules as its verified source has them (`PoolFees.sol`): fees accrue in the position until
/// anyone's claim, which pays whoever is the requester then; only the current requester hands the share on, never to
/// address 0. The requester's 80% share is what `accrue` adds here.
/// The main duel's hook, as far as the router reads it.
contract FakeDuel {
    Currency public imduel;
    Currency public imd;

    constructor(address imduel_, address imd_) {
        (imduel, imd) = (Currency.wrap(imduel_), Currency.wrap(imd_));
    }
}

contract FakePoolFees is IPoolFees {
    IMDuelToken immutable token0;
    IMDuelToken immutable token1;
    address immutable duel;
    mapping(uint64 => address) public requester;
    uint256 accrued0;
    uint256 accrued1;
    bool public broken; // a claim that reverts

    constructor(IMDuelToken token0_, IMDuelToken token1_, uint64 launchNumber, address requester_) {
        (token0, token1) = (token0_, token1_);
        duel = address(new FakeDuel(address(token0_), address(token1_)));
        requester[launchNumber] = requester_;
    }

    function accrue(uint256 amount0, uint256 amount1) external {
        (accrued0, accrued1) = (accrued0 + amount0, accrued1 + amount1);
    }

    function breakClaims() external {
        broken = true;
    }

    function claimFees(uint64 launchNumber) external returns (uint256 amount0, uint256 amount1) {
        require(!broken, "broken");
        (amount0, amount1) = (accrued0, accrued1);
        (accrued0, accrued1) = (0, 0);
        if (amount0 != 0) token0.transfer(requester[launchNumber], amount0);
        if (amount1 != 0) token1.transfer(requester[launchNumber], amount1);
    }

    function setRequester(uint64 launchNumber, address next) external {
        require(msg.sender == requester[launchNumber], "NotRequester");
        require(next != address(0), "ZeroRequester");
        requester[launchNumber] = next;
    }

    function positionOf(uint64 launchNumber)
        external
        view
        returns (PoolKey memory key, int24 tickLower, int24 tickUpper, address requester_)
    {
        if (requester[launchNumber] == address(0)) return (key, 0, 0, address(0)); // no such launch
        key = PoolKey(Currency.wrap(address(token0)), Currency.wrap(address(token1)), 12_500, 60, IHooks(duel));
        return (key, -887_220, 887_220, requester[launchNumber]);
    }
}

contract FeeRouterTest is Test {
    uint64 constant LAUNCH = 2843;
    IMDuelToken imduel;
    IMDuelToken imd;
    IMDuelStaking vault;
    FakePoolFees factory;
    IMDuelFeeRouter router;
    address launchWallet = makeAddr("launchWallet");
    address team = makeAddr("team");
    address admin = makeAddr("admin");
    address anyone = makeAddr("anyone");
    address nextRouter = makeAddr("nextRouter");
    uint256 now_ = 1_762_000_000; // the clock kept here: under via-IR a test's block.timestamp can read stale after a warp

    function setUp() public {
        vm.warp(now_);
        imduel = new IMDuelToken();
        imd = new IMDuelToken(); // a plain token standing in for IMD
        vault = new IMDuelStaking(IERC20(address(imduel)));
        factory = new FakePoolFees(imduel, imd, LAUNCH, launchWallet);
        imduel.transfer(address(factory), 100_000_000e18);
        imd.transfer(address(factory), 1_000e18);
        router = _router(LAUNCH, imduel, imd, address(vault), team, admin);
    }

    function _router(uint64 launch, IMDuelToken a, IMDuelToken b, address vault_, address team_, address admin_)
        internal
        returns (IMDuelFeeRouter)
    {
        return new IMDuelFeeRouter(factory, launch, IERC20(address(a)), IERC20(address(b)), vault_, team_, admin_);
    }

    function _wait(uint256 seconds_) internal {
        now_ += seconds_;
        vm.warp(now_);
    }

    /// The launch wallet keeps what accrued before the handoff by claiming first, then hands the requester over.
    function _handOver() internal {
        factory.claimFees(LAUNCH);
        vm.prank(launchWallet);
        factory.setRequester(LAUNCH, address(router));
    }

    function test_theHandoverKeepsWhatAccruedBefore() public {
        factory.accrue(1_000_000e18, 2e18);
        _handOver();
        assertEq(imd.balanceOf(launchWallet), 2e18);
        assertEq(imduel.balanceOf(launchWallet), 1_000_000e18);
        assertEq(factory.requester(LAUNCH), address(router));
    }

    function test_collectSendsIMDUELToTheVaultAndIMDToTheTeam() public {
        _handOver();
        factory.accrue(2_000_000e18, 3e18);
        vm.prank(anyone);
        (uint256 toVault, uint256 toTeam) = router.collect();
        assertEq(toVault, 2_000_000e18);
        assertEq(toTeam, 3e18);
        assertEq(imd.balanceOf(team), 3e18);
        // it joins the reserve; here it is the vault's first $IMDUEL, so the sync also made the dead stake from it
        assertEq(vault.reserve(), 2_000_000e18 - 1e18, "it joins the vault's reserve");
        assertEq(vault.totalAssets(), 1e18);
        _wait(1 days);
        assertLt(vault.reserve(), 2_000_000e18 - 1e18, "and starts releasing at once (the router syncs)");
        assertEq(imd.balanceOf(address(router)) + imduel.balanceOf(address(router)), 0, "the router keeps nothing");
    }

    function test_collectForwardsAClaimSomeoneElseMade() public {
        _handOver();
        factory.accrue(500e18, 1e18);
        factory.claimFees(LAUNCH); // anyone may claim straight on the factory: it lands in the router
        router.collect();
        assertEq(imd.balanceOf(team), 1e18);
        assertEq(imduel.balanceOf(address(vault)), 500e18);
    }

    function test_collectWithNothingAccruedIsHarmless() public {
        _handOver();
        (uint256 toVault, uint256 toTeam) = router.collect();
        assertEq(toVault + toTeam, 0);
    }

    function test_onlyTheAdminProposesAndHandsOn() public {
        vm.prank(anyone);
        vm.expectRevert(IMDuelFeeRouter.NotAdmin.selector);
        router.propose(nextRouter);
        vm.prank(team);
        vm.expectRevert(IMDuelFeeRouter.NotAdmin.selector);
        router.propose(nextRouter);
        _handOver();
        vm.prank(admin);
        router.propose(nextRouter);
        _wait(3 days);
        vm.prank(anyone);
        vm.expectRevert(IMDuelFeeRouter.NotAdmin.selector);
        router.handOn();
    }

    function test_aHandoffWaitsThreeDaysAndCollectsFirst() public {
        _handOver();
        vm.prank(admin);
        router.propose(nextRouter);
        assertEq(router.pending(), nextRouter);
        assertEq(router.readyAt(), now_ + 3 days);
        _wait(3 days - 1);
        vm.prank(admin);
        vm.expectRevert(IMDuelFeeRouter.NotReady.selector);
        router.handOn();
        _wait(1);
        factory.accrue(7_000e18, 4e18); // earned during the notice: paid by this router's split
        vm.prank(admin);
        router.handOn();
        assertEq(factory.requester(LAUNCH), nextRouter);
        assertEq(imd.balanceOf(team), 4e18);
        assertEq(imduel.balanceOf(address(vault)), 7_000e18);
        assertEq(router.pending(), address(0));
        factory.accrue(1e18, 1e18);
        factory.claimFees(LAUNCH);
        assertEq(imd.balanceOf(nextRouter), 1e18, "later fees go to the next requester");
    }

    /// No way around the last collect: a claim that fails stops the handoff too (and would stop any requester's).
    function test_aHandoffNeverSkipsTheLastCollect() public {
        _handOver();
        vm.prank(admin);
        router.propose(nextRouter);
        _wait(3 days);
        factory.breakClaims();
        vm.prank(admin);
        vm.expectRevert(bytes("broken"));
        router.handOn();
        assertEq(factory.requester(LAUNCH), address(router));
    }

    function test_aNewProposalRestartsTheNoticeAndZeroWithdrawsIt() public {
        _handOver();
        vm.prank(admin);
        router.propose(nextRouter);
        _wait(2 days);
        vm.prank(admin);
        router.propose(anyone);
        assertEq(router.readyAt(), now_ + 3 days);
        _wait(2 days);
        vm.prank(admin);
        vm.expectRevert(IMDuelFeeRouter.NotReady.selector);
        router.handOn();
        vm.prank(admin);
        router.propose(address(0));
        _wait(30 days);
        vm.prank(admin);
        vm.expectRevert(IMDuelFeeRouter.NotReady.selector);
        router.handOn();
        assertEq(factory.requester(LAUNCH), address(router));
    }

    function test_lockingIsForGoodAndCancelsAProposal() public {
        _handOver();
        vm.prank(admin);
        router.propose(nextRouter);
        vm.prank(anyone);
        vm.expectRevert(IMDuelFeeRouter.NotAdmin.selector);
        router.lock();
        vm.prank(admin);
        router.lock();
        assertEq(router.admin(), address(0));
        assertEq(router.pending(), address(0));
        _wait(30 days);
        vm.prank(admin);
        vm.expectRevert(IMDuelFeeRouter.NotAdmin.selector);
        router.handOn();
        vm.prank(admin);
        vm.expectRevert(IMDuelFeeRouter.NotAdmin.selector);
        router.propose(nextRouter);
        factory.accrue(1e18, 1e18);
        router.collect();
        assertEq(imd.balanceOf(team), 1e18, "a locked router still collects");
        assertEq(factory.requester(LAUNCH), address(router));
    }

    /// A stolen admin key can't take the fee faster than the notice, and the team's lock always ends it.
    function test_aLockStopsAProposalFromAStolenKey() public {
        _handOver();
        vm.prank(admin); // the thief, holding the admin key
        router.propose(anyone);
        _wait(1 days);
        vm.prank(admin); // the team, holding the same key
        router.lock();
        _wait(30 days);
        assertEq(factory.requester(LAUNCH), address(router));
    }

    /// The router checks its wiring against the live contracts, so a wrong argument can't strand the 1%.
    function test_aWrongSetupIsRefused() public {
        IMDuelToken other = new IMDuelToken();
        IMDuelStaking otherVault = new IMDuelStaking(IERC20(address(imd)));
        vm.expectRevert(IMDuelFeeRouter.InvalidSetup.selector);
        _router(LAUNCH + 1, imduel, imd, address(vault), team, admin); // a launch with no position
        vm.expectRevert(IMDuelFeeRouter.InvalidSetup.selector);
        _router(LAUNCH, imduel, other, address(vault), team, admin); // not the pool's tokens
        vm.expectRevert(IMDuelFeeRouter.InvalidSetup.selector);
        _router(LAUNCH, imd, imduel, address(vault), team, admin); // the tokens swapped: the vault stakes $IMDUEL
        vm.expectRevert(IMDuelFeeRouter.InvalidSetup.selector);
        _router(LAUNCH, imduel, imd, address(otherVault), team, admin); // a vault staking another token
        vm.expectRevert(IMDuelFeeRouter.InvalidSetup.selector);
        _router(LAUNCH, imduel, imd, address(vault), address(vault), admin); // the team is the vault
        vm.expectRevert(IMDuelFeeRouter.InvalidSetup.selector);
        _router(LAUNCH, imduel, imd, address(vault), address(0), admin);
        vm.expectRevert(IMDuelFeeRouter.InvalidSetup.selector);
        _router(LAUNCH, imduel, imd, address(vault), team, address(0));
        vm.expectRevert(IMDuelFeeRouter.InvalidSetup.selector);
        _router(LAUNCH, imduel, imduel, address(vault), team, admin);
        address plain = address(new PlainVault(IERC20(address(imduel))));
        vm.expectRevert(); // a vault that can't sync would trap every collect
        _router(LAUNCH, imduel, imd, plain, team, admin);
    }

    function test_budgets() public view {
        assertLt(address(router).code.length, 3_000, "runtime bytes");
    }
}
