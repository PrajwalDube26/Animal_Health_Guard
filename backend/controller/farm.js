const Farm = require('../models/Farm');

const create_farm=async(req,res)=>{
    try {
        const {farmName,farmType,location,size,numberOfAnimals} = req.body;

        const farm_to_save = new Farm({
            farmName,
            farmType,
            location,
            size,
            numberOfAnimals
        });

        const saved_farm=await farm_to_save.save();

        res.status(201).send({message:"farm created successfully",saved_farm:saved_farm})
    } 
    catch (error) {
        res.status(201).send({message:"problem in farm creation ",errror:error})
    }
};


const get_farm_by_Userid=async(req,res)=>{
    try {
        const {userId} = req.params;

        const user_farm = await Farm.find(userId);

        res.status(201).send({message:"getting farm successfully",user_farm:user_farm})
    }
    catch (error) {
        res.status(201).send({message:"problem in getting farm ",errror:error})
    }

};


const get_farm_by_id=async(req,res)=>{
    try {
        const {id} = req.paras;

        const farm = await Farm.findById(id);

        res.status(201).send({message:"getting farm successfully",farm:farm})
    }
    catch (error) {
        res.status(201).send({message:"problem in getting farm ",errror:error})
    }
};


const update_farm=async(req,res)=>{
    try {
        const {id} = req.paras;
        const {farmName,farmType,location,size,numberOfAnimals} = req.body;

        const farm = await Farm.findByIdAndUpdate(id,{$set:{
            farmName,
            farmType,
            location,
            size,
            numberOfAnimals
        }});

        res.status(201).send({message:"getting farm successfully",farm:farm})
    }
    catch (error) {
        res.status(201).send({message:"problem in getting farm ",errror:error})
    }
};


const delete_farm=async(req,res)=>{
    try {
        const {id} = req.paras;

        const deleted_farm = await Farm.findByIdAndDelete(id);

        res.status(201).send({message:"getting farm successfully",deleted_farm:deleted_farm})
    }
    catch (error) {
        res.status(201).send({message:"problem in getting farm ",errror:error})
    }
};