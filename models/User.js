const mongoose = require("mongoose");
const JWT = require('jsonwebtoken')
const userSchema = mongoose.Schema({
  country:{
    type:String
  },
  businessCategory:{
    type:String
  },
  email: {
    type: String,
    // unique: true,
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
  businessName:{
    type:String
  },
  contact:{
    type:String
  },
  city:{
    type:String
  },
  state:{
    type:String
  },
  zipCode:{
    type:String
  },
  referralID:{
    type:String,
    // unique:true
  },
  idActivateOn:{
    type:String
  },
  address:{
    type:String
  },
  notifications:{
    type:Array,
    default:[]
  },
  seenNotifications:{
    type:Array,
    default:[]
  },
  referralHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'History',
  }],
  CommissionHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ComHistory',
  }],
  userpayment:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"UserPayment"
  }
  ]
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

module.exports = mongoose.model("user", userSchema);