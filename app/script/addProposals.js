import dotenv from 'dotenv';
import { ethers } from 'ethers';
import fs from 'fs';

dotenv.config();

const contractAddress = process.env.CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractJson = JSON.parse(fs.readFileSync(process.env.CONTRACT_ABI_PATH));
const contractABI = contractJson.abi

const governanceContract = new ethers.Contract(contractAddress, contractABI, wallet);

const proposals = [
    "Proposal 1: Fund new project",
    "Proposal 2: Update governance rules",
    "Proposal 3: Allocate budget for marketing"
];

async function addProposals() {
    for (const description of proposals) {
        try {
            const tx = await governanceContract.createProposal(description);
            console.log(`Sent tx: ${tx.hash}`);

            const receipt = await tx.wait();
            console.log(`Proposal added: ${description}, Status: ${receipt.status}`);
        } catch (error) {
            console.error("Transaction failed:", error);
        }
    }
}

addProposals()
    .then(() => console.log("All proposals added successfully!"))
    .catch(error => console.error("Error adding proposals:", error));
