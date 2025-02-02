import dotenv from 'dotenv';
import { ethers } from 'ethers';
import fs from 'fs';

dotenv.config();

const args = process.argv.slice(2);
const proposalIndex = args[0];

const contractAddress = process.env.CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractJson = JSON.parse(fs.readFileSync(process.env.CONTRACT_ABI_PATH));
const contractABI = contractJson.abi

const governanceContract = new ethers.Contract(contractAddress, contractABI, wallet);

async function getProposal(idx) {
    try {
        const proposal = await governanceContract.proposals(idx)
        console.log(proposal);
    } catch (error) {
        console.error("Error fetching proposal:", error);
    }
}

getProposal(proposalIndex);