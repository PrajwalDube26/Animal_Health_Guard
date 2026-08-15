const mongoose = require('mongoose');

const training_module_Schema = new mongoose.Schema({
    adminid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['poultry', 'pig', 'dairy', 'goat', 'sheep', 'general', 'biosecurity'],
        required: true
    },
    language: {
        type: String,
        default: "English"
    }
}, { timestamps: true });

const training_module_Model = mongoose.model("training_module", training_module_Schema);

module.exports = training_module_Model;