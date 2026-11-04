The added tests exercise only `IMDuelStaking` and `IMDuelFeeRouter`. They reuse the existing
offline token/factory fixtures; they introduce no dependencies or deployment scripts.

| Discovery pass | Properties and coverage |
| --- | --- |
| Conservation | Every funded fee is queued, held by the router, forwarded, or received by the successor exactly once. Vault backing equals seed plus deposits plus donations plus forwarded fees minus withdrawals. Sum of tracked shares equals supply; immediately redeemable claims exclude the reserve. |
| State transitions | Independent model of proposals, cancellation, replacement, notice maturity, expiry, handover, and irreversible lock. Unauthorized operations and repeated handovers must revert with the expected reason. |
| Round trips and rounding | Repeated mint/redeem cycles and randomized deposit/redeem cycles cannot profit at one timestamp. Delegated exits consume share allowances, including one-share-short and unlimited approvals. |
| Adversarial inputs and liveness | Zero, one wei, the seed threshold, the full fixed supply, and a near-uint256-maximum deposit. Failed deposits/exits and downstream router failures preserve accounting and allowances. Every actor can fully redeem after a random sequence. |
| Protocol-specific properties | Donations are not backdated; dead-only periods do not release rewards; transfers to DEAD settle elapsed rewards without repricing them; sync is idempotent at the same timestamp; a full token still buys nonzero shares. Constructor tests isolate hook identity checks, both currency orders, and sync failure. |

`StakingAdversarial.t.sol` adds vault failure and arithmetic properties.
`FeeRouterAdversarial.t.sol` adds constructor and external-call rollback tests, including
failure after the first transfer, after both transfers, and after clearing a handover proposal.

`FeeRouterSequenceInvariant.t.sol` targets only its handler's 14 action selectors, with
256 runs of depth 128 and `fail-on-revert = true`. Expected reverts are checked explicitly;
unexpected reverts fail the campaign. Three actors stake, mint, redeem, withdraw and move
shares while fees accrue, third parties claim, donations arrive, and governance changes.
The ledger is driven by inputs and successful actions, independently of contract balances.
The deterministic handler test guarantees that collection, a mature handover, a failed
second handover, and permanent locking are exercised even before random exploration.
The three invariant functions are read-only; final redemption runs in `afterInvariant`.

Stateless fuzz tests use 1,000 runs, configured inline. Run the full suite with:

```sh
forge build
FOUNDRY_FUZZ_SEED=0x1ee125cc1abaa962f982b106ecaebf8a56fa95c70d7748a0327c4c5f97d4db81 forge test
```

The existing `StakingLaunchTest` now also accepts the fork suite's `ETH_RPC` setting.
When set, it must connect successfully to Ethereum mainnet with LaunchFactory present.
The exact constructor arguments and order remain in the existing `StakingLaunchProbe`:
both application contracts are created in one call, using the real dependencies.
The rehearsal additionally checks the named hook, unchanged dependency code, no deployment
ETH, closed deposits before funding, and rejection of the deployer's admin call.
No RPC URL or new fork block is embedded; this assignment specifies no fork block.

```sh
# Supply ETH_RPC externally, or pass the endpoint with forge's --fork-url option.
forge test --match-path test/StakingLaunch.t.sol -vv
```

Validation in this run: Foundry's formatter parsed all changed Solidity files successfully.
`forge build` and the seeded `forge test` were both attempted, but stopped before compilation
because downloading Solidity 0.8.26 failed with DNS resolution unavailable. The supplied
mainnet RPC refused connections both directly and through the prescribed proxy invocation.
No execution or live-fork pass is claimed. No contract defect was confirmed.
