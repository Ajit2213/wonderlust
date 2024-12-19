const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');
//here automatic username and id will create and password like schema
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    }
})

//this code available form passport-mongoose

userSchema.plugin(passportLocalMongoose);//any fault see there 

module.exports = mongoose.model('User', userSchema);