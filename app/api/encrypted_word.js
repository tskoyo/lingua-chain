const mongoose = require('mongoose');

const encrypted_word=new mongoose.Schema({
    encrypted_word:{type:Buffer, required:true},
    proposal_id:{type:String, required:true},
    created_by:{type:String, required:true},
    is_approved:{type:Boolean, default:false},

});

const ew= mongoose.model('encrypted_word',encrypted_word);
module.exports=ew;
