const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farmName: {
        type: String,
        required: true
    },
    farmType: {
        type: String,
        enum: ['dairy','poultry', 'pig','goat','sheep'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    numberOfAnimals: {
        type: Number,
        required: true,
        min: 1
    }
},{
    timestamps:true
});

const FarmModel = mongoose.model("Farm", farmSchema);

module.exports = FarmModel;