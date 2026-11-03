// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC4626} from "@openzeppelin/contracts/interfaces/IERC4626.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {Currency} from "v4-core/src/types/Currency.sol";

/// The IMD factory's fee calls (LaunchFactory, `src/PoolFees.sol` on Sourcify): anyone's `claimFees` pays the
/// launch's requester at that moment; only the current requester can hand the share on.
interface IPoolFees {
    function claimFees(uint64 launchNumber) external returns (uint256 amount0, uint256 amount1);
    function setRequester(uint64 launchNumber, address next) external;
    function positionOf(uint64 launchNumber)
        external
        view
        returns (PoolKey memory key, int24 tickLower, int24 tickUpper, address requester);
}

/// The main duel's hook names its two tokens.
interface IDuelTokens {
    function imduel() external view returns (Currency);
    function imd() external view returns (Currency);
}

/// The staking vault's public sync: folds what was sent to it into its reserve, so it starts releasing at once.
interface ISync {
    function sync() external;
}

/// The main duel's 1%: as the launch's requester it receives the 1% of every
/// trade, and anyone's `collect` sends the $IMDUEL to the staking vault (joining its reserve) and the IMD to the team.
/// The admin can hand the requester on (a new router, a new split) once a proposal has waited out NOTICE, and can
/// give up that power for good (`lock`). Nothing else is adjustable.
contract IMDuelFeeRouter {
    using SafeERC20 for IERC20;

    uint256 public constant NOTICE = 3 days;

    IPoolFees public immutable factory;
    uint64 public immutable launchNumber;
    IERC20 public immutable imduel;
    IERC20 public immutable imd;
    address public immutable vault;
    address public immutable team;

    address public admin; // zero once locked
    address public pending; // the proposed next requester, zero when none
    uint64 public readyAt; // when `pending` can be handed the requester

    event Proposed(address indexed next, uint256 readyAt);
    event HandedOn(address indexed next);
    event Locked();

    error InvalidSetup();
    error NotAdmin();
    error NotReady();

    /// Checks its own wiring against the live contracts: the launch's pool pairs exactly these two tokens, which its
    /// hook names $IMDUEL and IMD; the vault stakes $IMDUEL and syncs; the team is neither the vault nor nobody.
    constructor(IPoolFees factory_, uint64 launchNumber_, IERC20 imduel_, IERC20 imd_, address vault_, address team_, address admin_) {
        (PoolKey memory key,,,) = factory_.positionOf(launchNumber_);
        (address c0, address c1) = (Currency.unwrap(key.currency0), Currency.unwrap(key.currency1));
        bool paired = (c0 == address(imduel_) && c1 == address(imd_)) || (c0 == address(imd_) && c1 == address(imduel_));
        if (!paired || address(key.hooks) == address(0)) revert InvalidSetup();
        IDuelTokens duel = IDuelTokens(address(key.hooks));
        if (
            Currency.unwrap(duel.imduel()) != address(imduel_) || Currency.unwrap(duel.imd()) != address(imd_)
                || IERC4626(vault_).asset() != address(imduel_) || team_ == address(0) || team_ == vault_
                || admin_ == address(0)
        ) revert InvalidSetup();
        ISync(vault_).sync(); // a vault that can't sync would trap every collect
        (factory, launchNumber, imduel, imd, vault, team, admin) =
            (factory_, launchNumber_, imduel_, imd_, vault_, team_, admin_);
    }

    /// Claims the launch's fees and forwards everything held: $IMDUEL to the vault, IMD to the team (anyone).
    function collect() external returns (uint256 toVault, uint256 toTeam) {
        return _collect();
    }

    /// Proposes `next` as the launch's requester, ready after NOTICE; a new proposal restarts the notice, and
    /// address 0 withdraws it.
    function propose(address next) external {
        _onlyAdmin();
        uint64 at = next == address(0) ? 0 : uint64(block.timestamp + NOTICE);
        (pending, readyAt) = (next, at);
        emit Proposed(next, at);
    }

    /// Hands the requester to the proposal once its notice has run, after collecting what this router's split is owed.
    function handOn() external {
        _onlyAdmin();
        address next = pending;
        if (next == address(0) || block.timestamp < readyAt) revert NotReady();
        _collect();
        (pending, readyAt) = (address(0), 0);
        factory.setRequester(launchNumber, next);
        emit HandedOn(next);
    }

    /// Gives up the admin's power for good, withdrawing any proposal: the requester stays with this router.
    function lock() external {
        _onlyAdmin();
        (admin, pending, readyAt) = (address(0), address(0), 0);
        emit Locked();
    }

    function _collect() private returns (uint256 toVault, uint256 toTeam) {
        factory.claimFees(launchNumber);
        toVault = _forward(imduel, vault);
        toTeam = _forward(imd, team);
        if (toVault != 0) ISync(vault).sync();
    }

    function _onlyAdmin() private view {
        if (msg.sender != admin) revert NotAdmin();
    }

    function _forward(IERC20 token, address to) private returns (uint256 amount) {
        amount = token.balanceOf(address(this));
        if (amount != 0) token.safeTransfer(to, amount);
    }
}
