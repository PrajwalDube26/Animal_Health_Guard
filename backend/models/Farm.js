const mongoose=require('mongoose');

const farmSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    farmName:{
        type:String,
    },
    farmType:{
        type:String,
        enum:['poultry','pig'],
        required:true
    },
    location:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    numberOfAnimals:{
        type:Number,
        required:true,
        min: 1
    }
});

const FarmModel=mongoose.model("Farm",farmSchema);

module.exports=FarmModel;