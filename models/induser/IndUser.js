const mongoose = require("mongoose");
const JWT = require('jsonwebtoken')
const userSchema = mongoose.Schema({
  region:{
    type:String
  },
  country:{
    type:String
  },
  email: {
    type: String,
    unique: true,
  },
  password:{
    type:String,
  },
  firstName:{
    type:String
  },
  middleName:{
    type:String
  },
  lastName:{
    type:String
  },
  premisetype:{
    type:String
  },
  distfromcenter:{
    type:String
  },
  contact:{
    type:String
  },
  address:{
    type:String
  },
  referralcode:{
    type:String
  },
  notifications:{
    type:Array,
    default:[]
  },
  servicehistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceHis',
  }],
});

userSchema.methods.generateAuthToken = async function(){
  try{
      let tokenData = JWT.sign({_id:this._id},'VIJAYVJCOSNOCSN')
      return tokenData
  }
  catch(err){
      console.log(err)
  }
}

module.exports = mongoose.model("induser", userSchema);