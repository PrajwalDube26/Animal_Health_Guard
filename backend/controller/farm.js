const Farm = require('../models/Farm');


//login required

const create_farm=async(req,res)=>{
    try {
        const {farmName,farmType,location,size,numberOfAnimals} = req.body;
        const userId = req.user.id;

        const farm_to_save = new Farm({
            userId,
            farmName,
            farmType,
            location,
            size,
            numberOfAnimals
        });

        const saved_farm=await farm_to_save.save();

        res.status(201).json({message:"farm created successfully",farm:saved_farm})
    }
    catch (error) {
        res.status(500).json({message:"problem in farm creation ",error:error.message})
    }
};



//login required

const get_farm_by_Userid=async(req,res)=>{
    try {
        const userId = req.user.id;

        const user_farm = await Farm.find({userId});

        if(user_farm.length ===0)
        {
            return res.status(404).json({message:"farm not found"});
        }

        res.status(200).json({message:"getting farm successfully",farms:user_farm})
    }
    catch (error) {
        res.status(500).json({message:"problem in getting farm ",error:error.message})
    }

};



//login required

const get_farm_by_id=async(req,res)=>{
    try {
        const id = req.params.id;
        const userId = req.user.id;

        const farm = await Farm.findOne({_id:id,userId});

        if(!farm)
        {
            return res.status(404).json({message:"farm not found"});
        }

        res.status(200).json({message:"getting farm successfully",farm:farm})
    }
    catch (error) {
        res.status(500).json({message:"problem in getting farm ",error:error.message})
    }
};



//login required

const update_farm=async(req,res)=>{
    try {
        const id = req.params.id;
        const {farmName,farmType,location,size,numberOfAnimals} = req.body;
        const userId = req.user.id;

        const farm = await Farm.findOneAndUpdate({_id:id,userId},{$set:{
            farmName,
            farmType,
            location,
            size,
            numberOfAnimals
        }},{
            new:true,
            runValidators:true
        });

        if(!farm)
        {
            return res.status(404).json({message:"farm not found"});
        }

        res.status(200).json({message:"farm updated successfully",farm:farm})
    }
    catch (error) {
        res.status(500).json({message:"problem in updating farm ",error:error.message})
    }
};



//login required

const delete_farm=async(req,res)=>{
    try {
        const id = req.params.id;
        const userId = req.user.id;

        const deleted_farm = await Farm.findOneAndDelete({_id:id,userId});

        if(!deleted_farm)
        {
            return res.status(404).json({message:"farm not found"});
        }

        res.status(200).json({message:"deleting farm successfully",deleted_farm:deleted_farm})
    }
    catch (error) {
        res.status(500).json({message:"problem in deleting farm ",error:error.message})
    }
};


module.exports ={create_farm,get_farm_by_Userid,get_farm_by_id,update_farm,delete_farm};