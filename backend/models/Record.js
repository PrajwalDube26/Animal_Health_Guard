const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    farmId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["vaccination", "cleaning", "visitor_entry"],
        required: true
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const RecordModel = mongoose.model("Record", recordSchema);

module.exports = RecordModel;