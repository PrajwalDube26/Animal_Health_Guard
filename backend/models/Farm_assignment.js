const mongoose = require('mongoose');

const farm_assignment_schema = new mongoose.Schema({
    farmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
    },
    assignment_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Biosecurity_Assessment',
        required:true
    }
});

const farm_assignment = mongoose.model("FarmAssignment",farm_assignment_schema);

module.exports = farm_assignment;