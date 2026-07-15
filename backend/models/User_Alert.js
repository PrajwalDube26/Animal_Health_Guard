const mongoose = require('mongoose');

const user_alert_schema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    alertId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Alert',
        required:true
    }
});

const useralert = mongoose.model("Useralert",user_alert_schema);

module.exports = useralert;