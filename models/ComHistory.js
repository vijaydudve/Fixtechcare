const mongoose = require("mongoose");
const ComHistorySchema = mongoose.Schema({
    subscriptiondate: {
        type: String
    },
    LeadName: {
        type: String
    },
    solutionType: {
        type: String
    },
    commissionAmount: {
        type: String
    },
    paymentMode:{
        type:String,
    },
    referralID:{
        type:String
    }
});



module.exports = mongoose.model('comhistory', ComHistorySchema)