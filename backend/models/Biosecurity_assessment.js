const mongoose=require('mongoose');

const biosecurity_assessmentSchema=new mongoose.Schema({
    farmId:{
        type:String,
        required:true
    },
    answers:[
        {
            question: String,
            answer: String
        }
    ],
    riskScore:{
        type:Number,
        min: 0,
        max: 100

    },
    riskLevel:{
        type:String,
        enum:["low","medium","high"],
        required: true
    },
    date:{
        type:Date,
        default:Date.now,
    }
});

const Biosecurity_Assessment_Model=mongoose.model("Biosecurity_Assessment",biosecurity_assessmentSchema);

module.exports=Biosecurity_Assessment_Model;