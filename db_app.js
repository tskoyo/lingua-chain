require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');


const app = express();

app.use(express.json());


  
  
//connect to db
mongoose.connect(process.env.MONGO_URI,{
}).then(()=>{
    console.log('Connected to db');
}).catch((err)=>{
    console.log("error connect to db", err);
});

//start
const port = 3000;
app.listen(port,()=>{
    console.log(`Server on port ${port}`);
})

//CRUD
const ew=require('./api/encrypted_word');

//create encrypted word
app.post('/api/encrypted_word',async(req,res)=>{
    try{
        const {encrypted_word,proposal_id,created_by}=req.body;
        const new_ew=new ew({encrypted_word,proposal_id,created_by});
        await new_ew.save();
        res.json(new_ew);
    } catch(err){
        res.status(400).json({message:"error, can't save word",error:err});
        }
    });

//get all encrypted words
app.get('/api/encrypted_word',async(req,res)=>{
    try{
        const encrypted_words=await ew.find();
        res.json(encrypted_words);
    } catch(err){
        res.status(400).json({message:"error, can't get words",error:err});
    }
});

const proposal=require('./api/proposal');

//create a proposal
app.post('/api/proposal',async(req,res)=>{
    try{
        const {encrypted_data,onchain_proposal_id,created_by}=req.body;
        const new_proposal=new proposal({encrypted_data,onchain_proposal_id,created_by});
        await new_proposal.save();
        res.json(new_proposal);
    } catch(err){
        res.status(400).json({message:"error can't save proposal",error:err});
    }
    });
    
//get all proposals
app.get("/api/proposal",async(req,res)=>{
    try{
        const proposals=await proposal.find();
        res.json(proposals);
    }catch(err){
        res.status(400).json({message:"error, can't get proposals",error:err});
    }
});

const permit=require('./api/permission');

//create a permission
app.post("/api/permission",async(req,res)=>{
    try{
        const {user_address,access_grp,public_key}=req.body;
        const new_permit=new permit({user_address,access_grp,public_key});
        await new_permit.save();
        res.json(new_permit);
    } catch(err){
        res.status(400).json({message:"Error, can't save permission",error:err});
    }
});

//get all permissions
app.get('./api/permission',async(req,res)=>{
    try{
        const permissions=await permit.find();
        res.json(permissions);
    }catch(err){
        res.status(400).json({message:"error, can't get permissions",error:err});
    }
});

