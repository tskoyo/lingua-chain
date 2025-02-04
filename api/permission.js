const mongoose = require('mongoose');

const permission= new mongoose.Schema({
    user_address:{type:String, required:true},
    access_grp:{type:String, required:true},
    public_key:{type:Buffer,required:true},
});

const permit=mongoose.model('permit',permission);
module.exports=permit;
