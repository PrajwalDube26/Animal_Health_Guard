const mongoose = require('mongoose');

const biosecurity_assessmentSchema = new mongoose.Schema({
    adminid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    farmType: {
        type: String,
        enum: ['dairy', 'poultry', 'pig', 'goat', 'sheep'],
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
    question_answer: [
        {
            question: {
                type: String,
                required: true
            },
            answer: {
                type: Boolean,
                required: true
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

const Biosecurity_Assessment_Model = mongoose.model("Biosecurity_Assessment", biosecurity_assessmentSchema);

module.exports = Biosecurity_Assessment_Model;