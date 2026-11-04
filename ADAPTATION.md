# IMDuel staking launch adaptation

The existing `launch.json` still deploys exactly `IMDuelStaking`, then
`IMDuelFeeRouter`, with its original arguments and backward vault reference.
Only the two reproduced application defects below required production changes.
No token, pool, distributor, hook, engine, deployment script, dependency, or build
configuration was added or changed. Nothing was broadcast.

## Changes

| File | Change and reason |
| --- | --- |
| `src/IMDuelStaking.sol` | Scale the per-second reserve release rate by the fraction of shares outside `DEAD`; stop release when that fraction is zero. Settle before transfers changing `DEAD`'s balance. Fixes imported finding `836357b2aadae91a8a3b4d461dc09f3379b5f83a108c7596a32d6d269b7f4439` without forfeiting accrued rewards. |
| `src/IMDuelFeeRouter.sol` | Reject `propose(vault)` with `InvalidSetup`, matching the constructor's prohibition on paying IMD to the vault. Fixes `51df66ae9cb5c4ad48a64808636ed70c66c7b837aae78a5f97fbbee5e2f90375`. |
| `test/StakingAudit.t.sol` | Permanent regressions for retained and abandoned dust, repeated settlement, full and partial transfers to `DEAD`, delegated transfers, deposits/mints to `DEAD`, restart without backdating, conservation, and settlement-frequency independence. |
| `test/Staking.t.sol` | Update rate expectations and replace the assertion that dead-only holdings keep earning. The timing tests now include a redeemable stake, so they exercise release. Raise only the redemption gas budget from 90,000 to 95,000: the required balance read and rate calculation measure 92,084 gas in the existing test. |
| `test/FeeRouter.t.sol` | Assert that a rejected vault proposal leaves fees routed correctly and preserves an earlier valid proposal and its notice. Existing cancellation, expiration, collection, authorization, and locking tests remain. |
| `test/StakingLaunch.t.sol` | Reproduce the empty-chain constructor failure and provide a mainnet-fork rehearsal deploying exactly the manifest's two applications in one CREATE2 factory call, with the original arguments. Check wiring, explicit administration, runtime limits, and forbidden opcodes. |
| `ADAPTATION.md` | Record the changes, audit dispositions, validation, and mainnet verification limit. |

## Reserve release correction

Before the change, the supplied proof reproduced a release of
2,602,996.005817569161002153 IMDUEL from a 9,999,999 IMDUEL reserve in 30 days,
after an attacker deposited one wei and sent the resulting share to `DEAD`.
Every share was then held by `DEAD`. The same proof now releases exactly zero;
its holdings remain worth 1.000000000000000001 IMDUEL, including the donated wei.
A one-wei share kept outside `DEAD` enables less than one millionth of an IMDUEL
of release over the same period. The permanent regressions cover both cases.

Let `S = totalSupply()`, `A = S - balanceOf(DEAD)`, and `ONE = 1e27`. For `A > 0`,
the per-second retention factor is:

```text
keep = ONE - floor((ONE - KEEP) * A / S)
remaining reserve after t seconds = reserve * (keep / ONE)^t
```

The existing fixed-point exponentiation and rounding are retained. With no
redeemable shares there is no release and no division. The fixed token supply
bounds the new multiplication below 1e54, well within uint256. Rate rounding
favours retention; settlement retains the existing sub-token rounding error.

This applies the audit's proportional reduction to each second's rate rather
than multiplying an entire interval's release afterward. The latter would let
frequent `sync()` calls materially accelerate release. For a constant share
distribution, the implemented curve compounds consistently across settlements,
up to integer rounding. Fuzz tests compare split and unsplit intervals and
test every-second settlement with a dust stake.

The existing 1%-per-day base rate and dead stake remain. With one million
redeemable tokens initially staked beside the one-token dead stake, the reserve
releases approximately 0.999999005% per day. With half the shares redeemable it
releases approximately 0.501256275% per day; with only dead shares, zero. Released
assets still back all ERC-4626 shares pro rata, including dead shares. This is a
reduction of the dust-triggered loss, not a separate reward entitlement for live
holders. Transfers to other inaccessible addresses cannot be identified as dead
by the vault; `DEAD` is the existing designated address.

Deposits and withdrawals already settle before changing supply. Transfers to
`DEAD` now settle at the previous rate before its balance changes, including
`transferFrom`. Mint/burn keep their existing settlement paths. This preserves
share value at the transfer and prevents both lost accrual and backdated rewards.
ERC-4626 conversion, donation accounting, ownership, and withdrawal rights are
otherwise unchanged.

## Remaining audit dispositions and launch rehearsal

- **`e1d42d70184aab6230757bf38b1f442df721e04f6e8aaa012bd5a33ac2b4f1c4`:**
  The empty-chain failure reproduces. It is deliberately retained because this
  assignment explicitly requires the router to validate the live factory,
  hook token getters, and vault `asset()`/`sync()` in its constructor. Deferring
  those checks would contradict the approved behavior. The provided protected
  harness does not create a fork itself: its caller must supply mainnet state
  and preserve the code at the live LaunchFactory and hook. In particular,
  etching a deployment probe over the LaunchFactory that the constructor reads
  would invalidate the rehearsal. An unforked protected rehearsal still fails;
  this submission does not claim otherwise or bypass the checks.
- **`93f9707bfb4b51dd993d7ddbb336b0c6ffa6164bb69e33edc3e51354b6c308b7`:**
  Confirmed trust assumption, not a defect. The explicit admin can redirect the
  future requester share after three days, through the end of the following
  three days, with collection before handover. `lock()` permanently renounces
  this power and cancels any proposal. These powers and expiration boundaries
  remain covered by the existing tests. Other recipient choices remain the
  admin's responsibility; the new guard specifically excludes the vault.
- **`557f94881f9a8401f4b904fd4d06c849732d057df672c9a24bbed6197b96d7c1`:**
  Coverage information, not a defect. Review covered the two applications,
  manifest, their tests, vendored ERC-4626/ERC-20 implementation, the token's
  local transfer semantics, the supplied protected checks, and the pinned
  eth-security checklist. The already-live hook and chess engine were not
  re-audited. The earlier audit's external-source and live-state conclusions
  were not independently re-verified here.

All three actionable reports were reproduced; none was dismissed as
unreproducible. The constructor report remains a rehearsal-environment
requirement under the explicit mainnet-only brief.

The supplied Ethereum RPC could not be reached, both directly and through the
specified proxy route (`curl: (7) Failed to connect ... Couldn't connect to
server`). Therefore the mainnet rehearsal and live fee/trade paths were **not
verified**. The new mainnet test explicitly skips without live factory code;
the pre-existing `StakingForkTest` functions return early without `ETH_RPC`.
Their offline results do not establish successful mainnet execution.

The deployer can run the exact-argument constructor rehearsal using:

```sh
forge test --fork-url "$ETH_RPC" --match-test test_exactLaunchOnMainnet -vv
```

The existing integration suite remains available with `ETH_RPC` set and
`forge test --match-path test/StakingFork.t.sol -vv`. The original public RPC
reference in that suite is `https://gateway.tenderly.co/public/mainnet`.
These are fork simulations, not broadcasts. After actual launch, the launch
wallet still funds the vault and transfers the existing requester role as
described in the unchanged manifest; the factory performs no initialization.

## Validation

- `forge build` and `forge test` passed with the unchanged project configuration,
  using the already-available solc 0.8.26 via `FOUNDRY_SOLC` to avoid a failed
  compiler-download DNS lookup. No dependencies or compiler were installed.
  The final suite, excluding the temporary proof copy, reported **232 passed,
  0 failed, 1 skipped** (the explicit mainnet rehearsal).
- All fuzz runs used
  `FOUNDRY_FUZZ_SEED=0x1ee125cc1abaa962f982b106ecaebf8a56fa95c70d7748a0327c4c5f97d4db81`.
  The existing staking invariant campaign completed 256 runs / 128,000 calls
  with no reverts. The new dust and settlement regressions passed, as did the
  original supplied proof after repair.
- Constructor ABIs remain nonpayable with 1 and 7 static arguments respectively.
  No initialization, ownership-by-caller, proxy, or external library linkage was
  introduced. The manifest order, addresses, and arguments are unchanged.
- Built application runtimes are 5,313 bytes (vault) and 2,457 bytes (router).
  Init code plus constructor arguments is 6,446 and 4,080 bytes respectively.
  Both fit the protected 24,576/49,152-byte limits and pass the protected
  reachable-opcode scan for DELEGATECALL, CALLCODE, and SELFDESTRUCT.
- Slither and Mythril were not run. No live deployment or explorer verification
  was performed.
