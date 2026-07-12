const mongoose = require('mongoose');

const biosecurity_assessmentSchema = new mongoose.Schema({
    farmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
    },
    riskScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    riskLevel: {
        type: String,
        enum: ["low", "medium", "high"],
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const Biosecurity_Assessment_Model = mongoose.model("Biosecurity_Assessment", biosecurity_assessmentSchema);

module.exports = Biosecurity_Assessment_Model;