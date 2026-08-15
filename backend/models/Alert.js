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
    district: {
        type: String,
        enum: ["Ahilyanagar", "Akola", "Amravati", "Beed", "Bhandara", "Buldhana", "Chandrapur","Chhatrapati Sambhajinagar","Dharashiv", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik",  "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    farmType: {
        type: String,
        enum: ['dairy','poultry', 'pig','goat','sheep'],
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