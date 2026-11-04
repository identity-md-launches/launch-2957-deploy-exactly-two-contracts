// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IMDuelStaking} from "../src/IMDuelStaking.sol";
import {IMDuelFeeRouter, IPoolFees} from "../src/IMDuelFeeRouter.sol";

/// The exact launch.json order and static arguments, in one factory call with zero ETH and no initialization.
/// Only these two application contracts are created; all other dependencies must already exist on the fork.
contract StakingLaunchProbe {
    function deploy() external returns (IMDuelStaking vault, IMDuelFeeRouter router) {
        IERC20 imduel = IERC20(0xc012b8Db13C57beCd950eEfB70540e6f973A3C73);
        address wallet = 0x6AA302EFf055259c9Cf177f33Ae3cBA5d4135B23;
        vault = new IMDuelStaking{salt: bytes32(uint256(1))}(imduel);
        router = new IMDuelFeeRouter{salt: bytes32(uint256(2))}(
            IPoolFees(0x12C63b581d07093F6126bc02263c58f7EadaA96F),
            2843,
            imduel,
            IERC20(0xD34a99Bc0f67aE1bbd63C660e6d0b0dd03E263B7),
            address(vault),
            wallet,
            wallet
        );
    }
}

contract StakingLaunchTest is Test {
    address constant FACTORY = 0x12C63b581d07093F6126bc02263c58f7EadaA96F;
    address constant IMDUEL = 0xc012b8Db13C57beCd950eEfB70540e6f973A3C73;
    address constant IMD = 0xD34a99Bc0f67aE1bbd63C660e6d0b0dd03E263B7;
    address constant WALLET = 0x6AA302EFf055259c9Cf177f33Ae3cBA5d4135B23;

    /// Imported audit e1d42d70: this failure is deliberate under the task's mainnet-only constructor requirement.
    function test_emptyChainCannotSubstituteForMainnet() public {
        vm.etch(FACTORY, hex"");
        vm.chainId(1);
        IMDuelStaking vault = new IMDuelStaking(IERC20(IMDUEL));
        assertEq(vault.asset(), IMDUEL);
        assertEq(vault.decimals(), 18);
        vm.expectRevert();
        new IMDuelFeeRouter(IPoolFees(FACTORY), 2843, IERC20(IMDUEL), IERC20(IMD), address(vault), WALLET, WALLET);
    }

    /// Run with forge test --fork-url <Ethereum RPC> --match-test test_exactLaunchOnMainnet.
    function test_exactLaunchOnMainnet() public {
        if (FACTORY.code.length == 0) {
            vm.skip(true);
            return;
        }
        assertEq(block.chainid, 1);
        StakingLaunchProbe probe = new StakingLaunchProbe();
        (IMDuelStaking vault, IMDuelFeeRouter router) = probe.deploy();
        assertEq(vault.asset(), IMDUEL);
        assertEq(vault.decimals(), 18);
        assertEq(address(router.factory()), FACTORY);
        assertEq(router.launchNumber(), 2843);
        assertEq(address(router.imduel()), IMDUEL);
        assertEq(address(router.imd()), IMD);
        assertEq(router.vault(), address(vault));
        assertEq(router.team(), WALLET);
        assertEq(router.admin(), WALLET);
        assertTrue(router.admin() != address(probe));
        assertEq(vault.totalSupply(), 0);
        _checkRuntime(address(vault));
        _checkRuntime(address(router));
    }

    function _checkRuntime(address application) private view {
        bytes memory code = application.code;
        assertGt(code.length, 0);
        assertLe(code.length, 24_576);
        bool reachable = true;
        for (uint256 i; i < code.length; ++i) {
            uint8 op = uint8(code[i]);
            if (op == 0x5b) reachable = true;
            if (op >= 0x60 && op <= 0x7f) {
                i += op - 0x5f;
                continue;
            }
            if (reachable) assertTrue(op != 0xf4 && op != 0xf2 && op != 0xff, "forbidden runtime opcode");
            if (op == 0x00 || op == 0x56 || op == 0xf3 || op == 0xfd || op == 0xfe || op == 0xff) reachable = false;
        }
    }
}
