// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {LCTGovernance} from "../src/LCTGovernance.sol";
import {LCToken} from "../src/LCToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LCTGovernanceTest is Test {
    LCTGovernance governance;
    LCToken lcToken;
    address player1 = makeAddr("player1");
    address player2 = makeAddr("player2");
    address player3 = makeAddr("player3");
    address player4 = makeAddr("player4");

    uint256 public constant INITIAL_SUPPLY = 500 ether;
    uint256 public constant MIN_STAKE = 5 ether;

    function setUp() public {
        lcToken = new LCToken(INITIAL_SUPPLY);
        governance = new LCTGovernance(lcToken, MIN_STAKE);

        IERC20(lcToken).transfer(player1, 6 ether);
        IERC20(lcToken).transfer(player2, 6 ether);
        IERC20(lcToken).transfer(player3, 6 ether);
        IERC20(lcToken).transfer(player4, 6 ether);
    }

    function testStakeTokens() public {
        vm.startPrank(player1, player1);

        IERC20(lcToken).approve(address(governance), 1.5 ether);
        governance.stakeTokens(1.5 ether);

        uint256 governanceBalance = IERC20(lcToken).balanceOf(address(governance));
        uint256 playerBalance = IERC20(lcToken).balanceOf(player1);
        assertEq(governanceBalance, 1.5 ether);
        assertEq(playerBalance, 4.5 ether);
    }

    function testUnstakeTokens() public {
        vm.startPrank(player1, player1);
        IERC20(lcToken).approve(address(governance), 5 ether);
        governance.stakeTokens(5 ether);

        governance.unstakeTokens(3 ether);

        uint256 governanceBalance = IERC20(lcToken).balanceOf(address(governance));
        uint256 playerBalance = IERC20(lcToken).balanceOf(player1);
        assertEq(governanceBalance, 2 ether); // 5 - 3 = 2
        assertEq(playerBalance, 4 ether); // 6 - 5 + 3 = 4 (initial 6, staked 5, unstaked 3)
    }

    function testCreateProposal() public {
        vm.startPrank(player1, player1);
        governance.createProposal("Test proposal");

        (uint256 id, string memory desc,,, address proposer) = governance.proposals(0);
        assertEq(id, 0);
        assertEq(desc, "Test proposal");
        assertEq(proposer, player1);
    }

    function testVotingWorkflow() public {
        vm.startPrank(player1);
        IERC20(lcToken).approve(address(governance), 5 ether);
        governance.stakeTokens(5 ether);
        vm.stopPrank();

        vm.startPrank(player2);
        governance.createProposal("Funding Proposal");
        vm.stopPrank();

        vm.startPrank(player1);
        governance.voteOnProposal(0, true);
        vm.stopPrank();

        (,, uint256 forVotes,,) = governance.proposals(0);
        assertEq(forVotes, 1);

        assertTrue(governance.hasVoted(0, player1));
    }

    function testInsufficientStakeVoting() public {
        vm.startPrank(player3, player3);
        IERC20(lcToken).approve(address(governance), 3 ether);
        governance.stakeTokens(3 ether);

        governance.createProposal("Test Proposal");

        vm.expectRevert("Insufficient stake to vote");
        governance.voteOnProposal(0, true);
    }

    function testDoubleVotingPrevention() public {
        vm.startPrank(player4, player4);
        IERC20(lcToken).approve(address(governance), 5 ether);
        governance.stakeTokens(5 ether);

        governance.createProposal("Test Proposal");

        governance.voteOnProposal(0, true);

        vm.expectRevert("Already voted on this proposal");
        governance.voteOnProposal(0, true);
    }

    function testUnstakeAfterVoting() public {
        vm.startPrank(player1, player1);

        IERC20(lcToken).approve(address(governance), 5 ether);
        governance.stakeTokens(5 ether);

        governance.createProposal("Unstake Test");
        governance.voteOnProposal(0, true);

        governance.unstakeTokens(5 ether);

        assertEq(IERC20(lcToken).balanceOf(player1), 6 ether);
        assertEq(governance.stakedBalances(player1), 0);
    }

    function testInvalidProposalVoting() public {
        vm.startPrank(player1, player1);
        IERC20(lcToken).approve(address(governance), 5 ether);
        governance.stakeTokens(5 ether);

        vm.expectRevert("Invalid proposal ID");
        governance.voteOnProposal(999, true);
    }

    function xtestEdgeCases() public {
        vm.startPrank(player1, player1);
        vm.expectRevert("Cannot stake 0 tokens");
        governance.stakeTokens(0);

        vm.expectRevert("Cannot unstake 0 tokens");
        governance.unstakeTokens(0);

        IERC20(lcToken).approve(address(governance), 1 ether);
        governance.stakeTokens(1 ether);

        vm.expectRevert("Insufficient staked balance");
        governance.unstakeTokens(2 ether);
    }

    function testVoteWithExactMinimumStake() public {
        vm.startPrank(player1, player1);

        IERC20(lcToken).approve(address(governance), 5 ether);
        governance.stakeTokens(5 ether);

        governance.createProposal("Exact Stake Proposal");

        governance.voteOnProposal(0, false);

        (,,, uint256 againstVotes,) = governance.proposals(0);
        assertEq(againstVotes, 1);
    }
}
