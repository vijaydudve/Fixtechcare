const mongoose = require("mongoose");
const userpaymentSchema = mongoose.Schema({
    paymentMethod:{
        type:String
    },
    accountHolder:{
        type:String
    },
    accountNumber:{
        type:String
    },
    bankName:{
        type:String
    },
    swiftCode:{
        type:String
    },
    ifscCode:{
        type:String
    },
    mobileNumber:{
        type:String
    },
    address:{
        type:String
    },
    paypaldetails:{
        type:String
    },
    paymentLinkdetails:{
        type:String
    }
});


module.exports = mongoose.model("userpayment", userpaymentSchema);