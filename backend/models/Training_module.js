const mongoose=require('mongoose');

const training_module_Schema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    content:{
        type:['video','pdf','text'],
        required:true
    },
    category:{
        type:String,
        enum:['poultry','pig'],
        required:true
    },
    language:{
        type:String
    }
});

const training_module_Model=mongoose.model("training_module",training_module_Schema);

module.exports=training_module_Model;