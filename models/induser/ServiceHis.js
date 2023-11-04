const mongoose = require("mongoose");
const ServiceHistorySchema = mongoose.Schema({
    subscriptiondate: {
        type: String
    },
    subscriptiontime: {
        type: String
    },
    servicetype: {
        type: String
    },
    maintainenceEng: {
        type: String
    },
    problemfixed:{
        type:String,
    },
    userid:{
        type:String
    }
});



module.exports = mongoose.model('servicehis', ServiceHistorySchema)