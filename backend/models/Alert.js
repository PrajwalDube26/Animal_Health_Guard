const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
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