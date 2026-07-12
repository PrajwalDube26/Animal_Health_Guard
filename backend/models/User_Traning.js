const mongoose = require('mongoose');

const user_traning_schema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    traningId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'training_module'
    }
});

const usertraning = mongoose.model("Usertraning",user_traning_schema);

module.exports = usertraning;