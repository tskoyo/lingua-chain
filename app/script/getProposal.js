import dotenv from "dotenv";
import { ethers } from "ethers";
import fs from "fs";

dotenv.config();

const args = process.argv.slice(2);
const command = args[0];
const proposalIndex = args[1];

const contractAddress = process.env.CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractJson = JSON.parse(fs.readFileSync(process.env.CONTRACT_ABI_PATH));
const contractABI = contractJson.abi;

const governanceContract = new ethers.Contract(
  contractAddress,
  contractABI,
  wallet,
);

async function getProposal(idx) {
  try {
    const proposal = await governanceContract.proposals(idx);
    printProposal(proposal);
  } catch (error) {
    console.error("Error fetching proposal:", error);
  }
}

async function getAllProposals() {
  const proposalCount = await governanceContract.getAllProposals();

  console.log(proposalCount);

  // for (let index = 0; index < proposalCount; index++) {
  //   await getProposal(index);
  // }
}

function printProposal(proposal) {
  console.log(`Proposal ID: ${proposal.id}`);
  console.log(`Description: ${proposal.description}`);
  console.log(`For votes: ${proposal.forVotes}`);
  console.log(`Against Votes: ${proposal.againstVotes}`);
  console.log(`Proposer: ${proposal.proposer}`);
  console.log("----------------------");
}

if (command == "getProposal" && proposalIndex != undefined) {
  getProposal(proposalIndex);
} else if (command == "getAllProposals") {
  getAllProposals();
} else {
  console.log("Usage:");
  console.log("  node getProposal.js getProposal <proposalIndex>");
  console.log("  node getProposal.js getAllProposals");
}

