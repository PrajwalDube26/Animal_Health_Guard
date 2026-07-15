const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    adminid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Admin',
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
        enum:["Bird Flu","Swine Fever","Newcastle Disease","Other"],
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