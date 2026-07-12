const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    diseaseType: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: true
    }
}, { timestamps: true });

const AlertModel = mongoose.model("Alert", alertSchema);

module.exports = AlertModel;