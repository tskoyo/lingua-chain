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

        governance.createProposal("Proposal 1", "Description for Proposal 1");
        governance.createProposal("Proposal 2", "Description for Proposal 2");
        governance.createProposal("Proposal 3", "Description for Proposal 3");

        vm.stopBroadcast();

        console.log("Token deployed at:", address(lcToken));
        console.log("DAO deployed at:", address(governance));
    }
}
