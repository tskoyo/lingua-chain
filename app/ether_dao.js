const {ethers}=require('ethers');

//provider
const provider= new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/your_infura_key');

//contract abi and address
const contractAddress='0x';
const contractABI=[
    //for proposal creation event, add more ABI
    "event ProposalCreated(uint256 proposal_id, string proposal_data)",
    "event proposalPassed(uint256 proposal_id)",
    "event ProposalRejected(uint256 proposal_id)"
];

//contract instance
const contract=new ethers.Contract(contractAddress,contractABI,provider);
module.exports=contract;

async function checkConnect(){
    const blockNumber=await provider.getBlockNumber();
    console.log("blockNumber: ",blockNumber);
}
checkConnect();

//listen
contract.on('ProposalCreated',async (proposal_id,proposal_data)=>{
    console.log(`ProposalCreated: id= ${proposal_id}, data= ${proposal_data}`);

//store in database
const proposal=require('./api/proposal');


try{
    const new_proposal=new proposal({
        encrypted_data:Buffer.from(proposal_data),
        onchain_proposal_id:proposal_id,
        status:'pending',
        created_by: '0x proposer address'
    });
    await new_proposal.save();
    console.log('proposal saved');
} catch(err){
    console.log('error saving proposal',err);
}
});

//listen for proposalPassed
contract.on('ProposalPassed', async (proposal_id)=>{
    console.log(`ProposalPassed: id= ${proposal_id}`);

    try {
        const proposal=await proposal.findOneAndUpdate(
            {onchain_proposal_id:proposal_id},
            {status:'approved'},
            {new: true});

    } catch (err) {
        console.log('error updating proposal', err);
    }
});

//listen for proposalRejected
contract.on('ProposalRejected', async (proposal_id)=>{
    console.log('ProposalRejected: id=${proposal_id}');
    try{
        const proposal=await proposal.findOne(
            {onchain_proposal_id:proposal_id},
            {status:'rejected'});
    } catch(err){
        console.log("error updating proposal",err);
    }
});