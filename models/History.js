const mongoose = require("mongoose");
const HistorySchema = mongoose.Schema({
    date: {
        type: String
    },
    LeadName: {
        type: String
    },
    solutionType: {
        type: String
    },
    categoryPremises: {
        type: String
    },
    referralID:{
        type:String
    }
});



module.exports = mongoose.model('history', HistorySchema)