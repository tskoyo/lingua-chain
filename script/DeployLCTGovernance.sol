// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/LCTGovernance.sol";
import "../src/LCToken.sol";

contract DeployLCTGovernance is Script {
    function run() external {
        vm.startBroadcast();

        LCToken lcToken = new LCToken(50_000 ether);
        LCTGovernance governance = new LCTGovernance(lcToken, 1 ether);

        vm.stopBroadcast();

        console.log("Token deployed at:", address(lcToken));
        console.log("DAO deployed at:", address(governance));
    }
}
