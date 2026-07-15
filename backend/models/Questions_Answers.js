const mongoose = require('mongoose');

const question_answers_schema = new mongoose.Schema({
    assignment_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Biosecurity_Assessment',
        required:true
    },
    question:{
        type:String,
        required:true
    },
    answer:{
        type:Boolean,
        required:true
    }
});

const Questions_Answers_model = mongoose.model("Questions_Answers",question_answers_schema);

module.exports = Questions_Answers_model;