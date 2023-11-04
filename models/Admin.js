const mongoose = require("mongoose");
const JWT = require('jsonwebtoken')
const adminSchema = mongoose.Schema({
    name:{
      type:String,
    },
    email: {
      type: String,
      // unique: true,
    },
    password:{type: String},
    UserID:{
      type:Array,
      default:[]
    }
  });

  adminSchema.methods.generateAuthToken = async function(){
    try{
        let tokenData = JWT.sign({_id:this._id},'VIJAYVJCOSNOCSN')
        return tokenData
    }
    catch(err){
        console.log(err)
    }
  }
  
  module.exports = mongoose.model('admin',adminSchema)