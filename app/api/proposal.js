const mongoose = require('mongoose');

const proposal=new mongoose.Schema({
    encrypted_data:{type:Buffer, required:true},
    onchain_proposal_id:{type:String, required:true},
    status:{type:String,enum:['pending','approved','rejected'], default:'pending'},
    created_by:{type:String, required:true}, //eth address
});

const propose = mongoose.model('propose',proposal);

module.exports=propose;

