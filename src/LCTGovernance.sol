// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract LCTGovernance {
    using SafeERC20 for IERC20;

    struct Proposal {
        uint256 id;
        string name;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        address proposer;
    }

    IERC20 public immutable governanceToken;
    uint256 public immutable minimumStake;

    Proposal[] public proposals;
    mapping(address => uint256) public stakedBalances;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed proposalId, address proposer);
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support
    );
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount);

    constructor(IERC20 _token, uint256 _minimumStake) {
        governanceToken = _token;
        minimumStake = _minimumStake;
    }

    function stakeTokens(uint256 _amount) external {
        require(_amount > 0, "Cannot stake 0 tokens");
        stakedBalances[msg.sender] += _amount;
        governanceToken.safeTransferFrom(msg.sender, address(this), _amount);
        emit TokensStaked(msg.sender, _amount);
    }

    function unstakeTokens(uint256 _amount) external {
        require(
            _amount <= stakedBalances[msg.sender],
            "Insufficient staked balance"
        );
        stakedBalances[msg.sender] -= _amount;
        governanceToken.safeTransfer(msg.sender, _amount);
        emit TokensUnstaked(msg.sender, _amount);
    }

    function createProposal(
        string memory _name,
        string memory _description
    ) external {
        uint256 proposalId = proposals.length;
        Proposal memory newProposal = Proposal({
            id: proposalId,
            name: _name,
            description: _description,
            forVotes: 0,
            againstVotes: 0,
            proposer: msg.sender
        });
        proposals.push(newProposal);

        emit ProposalCreated(proposalId, msg.sender);
    }

    function voteOnProposal(uint256 _proposalId, bool _support) external {
        require(
            stakedBalances[msg.sender] >= minimumStake,
            "Insufficient stake to vote"
        );
        require(
            !hasVoted[_proposalId][msg.sender],
            "Already voted on this proposal"
        );
        require(_proposalId < proposals.length, "Invalid proposal ID");

        hasVoted[_proposalId][msg.sender] = true;

        if (_support) {
            proposals[_proposalId].forVotes++;
        } else {
            proposals[_proposalId].againstVotes++;
        }

        emit VoteCast(_proposalId, msg.sender, _support);
    }

    function getProposalCount() public view returns (uint256) {
        return proposals.length;
    }

    function getAllProposals() public view returns (Proposal[] memory) {
        return proposals;
    }
}
