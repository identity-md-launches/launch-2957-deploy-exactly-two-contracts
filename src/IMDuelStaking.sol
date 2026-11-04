// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

/// $IMDUEL staking. OpenZeppelin's
/// ERC-4626: stake $IMDUEL for sIMDUEL, whose worth in $IMDUEL rises every second, with nothing to claim. Rewards
/// come from a reserve: any $IMDUEL sent to the vault joins it. Its base release is 1% a day, compounded per second,
/// with the per-second rate scaled by the fraction of shares outside DEAD. The release goes into
/// what the shares are worth. The first sync after the reserve holds DEAD_ASSETS stakes them for 0x...dEaD, a stake
/// that can never leave, so the vault is never empty: until then deposits are closed. The reserve releases only while
/// someone else is staked too, so it never pays a dead stake alone, and a dust stake enables only a dust rate. Shares
/// have $IMDUEL's 18 decimals (no offset: the dead stake's 1e18 shares are what keep rounding to dust). No owner,
/// nothing adjustable; leave any time, no fee.
contract IMDuelStaking is ERC4626 {
    address public constant DEAD = 0x000000000000000000000000000000000000dEaD;
    uint256 public constant DEAD_ASSETS = 1e18;
    /// 0.99^(1/86400) in ONE: what is left of the reserve after a second
    uint256 internal constant KEEP = 999999883676675127810317475;
    uint256 internal constant ONE = 1e27;

    /// Every amount is bounded by $IMDUEL's fixed supply (1e27), so each fits 128 bits.
    struct Pool {
        uint128 staked; // the $IMDUEL the shares are worth (totalAssets)
        uint128 reserve; // the $IMDUEL still to be released
        uint64 updated; // when the release was last worked out
    }

    Pool private _pool;

    constructor(IERC20 imduel) ERC4626(imduel) ERC20("Staked IMDuel", "sIMDUEL") {}

    /// Works out the release so far and folds $IMDUEL sent here into the reserve (anyone); the first time the reserve
    /// holds DEAD_ASSETS, stakes them for 0x...dEaD.
    function sync() external {
        _settle();
        if (totalSupply() == 0 && _pool.reserve >= DEAD_ASSETS) {
            _pool.reserve -= uint128(DEAD_ASSETS);
            _pool.staked += uint128(DEAD_ASSETS);
            _mint(DEAD, DEAD_ASSETS); // 1:1, the empty vault's rate: what a first deposit gets
            emit Deposit(address(this), DEAD, DEAD_ASSETS, DEAD_ASSETS);
        }
    }

    /// The $IMDUEL the shares are worth now.
    function totalAssets() public view override returns (uint256) {
        return _now().staked;
    }

    /// The $IMDUEL still to be released, now.
    function reserve() external view returns (uint256) {
        return _now().reserve;
    }

    /// Closed until the dead stake exists (the first sync after the seed).
    function maxDeposit(address) public view override returns (uint256) {
        return totalSupply() == 0 ? 0 : type(uint256).max;
    }

    function maxMint(address) public view override returns (uint256) {
        return totalSupply() == 0 ? 0 : type(uint256).max;
    }

    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal override {
        _settle();
        _pool.staked += uint128(assets); // an amount past the supply can't be pulled: the whole call reverts
        super._deposit(caller, receiver, assets, shares);
    }

    function _withdraw(address caller, address receiver, address owner, uint256 assets, uint256 shares)
        internal
        override
    {
        _settle();
        _pool.staked -= uint128(assets);
        super._withdraw(caller, receiver, owner, assets, shares);
    }

    function _settle() private {
        _pool = _now();
    }

    /// Mint/burn already settle in _deposit/_withdraw. A transfer changing DEAD's balance must also settle at the
    /// old rate, so neither accrued rewards nor the waiting time can be repriced by moving shares to DEAD.
    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0) && to != address(0) && (from == DEAD || to == DEAD)) _settle();
        super._update(from, to, value);
    }

    /// The pool once the release so far is worked out: nothing is released while no shares but the dead stake's exist
    /// (every change to the supply or DEAD's balance settles first); the reserve waits. Scale the per-second rate,
    /// not the result of an elapsed interval, so splitting an interval with sync cannot accelerate the release.
    /// $IMDUEL that arrived since the last action joins the reserve after the release so far.
    function _now() private view returns (Pool memory p) {
        p = _pool;
        uint256 supply = totalSupply();
        uint256 redeemable = supply - balanceOf(DEAD);
        if (redeemable != 0) {
            uint256 keep = ONE - (ONE - KEEP) * redeemable / supply;
            uint256 release = p.reserve - p.reserve * _keep(block.timestamp - p.updated, keep) / ONE;
            (p.reserve, p.staked) = (p.reserve - uint128(release), p.staked + uint128(release));
        }
        uint256 arrived = IERC20(asset()).balanceOf(address(this)) - p.staked - p.reserve;
        p.reserve += uint128(arrived);
        p.updated = uint64(block.timestamp);
    }

    /// x^t: what is left of the reserve after `t` seconds, by squaring (one step per bit of t).
    function _keep(uint256 t, uint256 x) private pure returns (uint256 left) {
        left = ONE;
        unchecked {
            for (; t != 0; t >>= 1) {
                if (t & 1 != 0) left = left * x / ONE; // both at most ONE: the product fits
                x = x * x / ONE;
            }
        }
    }
}
