const training_module = require('../models/Training_module');

const createTraningModule = async(req,res)=>{
    try {
        const {title,description,content,category} = req.body;
        const adminid = req.admin.id;

        const training_module_to_save = new training_module({
            adminid,
            title,
            description,
            content,
            category
        })

        const saved_training_module = await training_module_to_save.save();

        if(!saved_training_module)
        {
            return res.status(400).json({ message : "not saved"});
        }

        res.status(201).json({message:"created sussesfully" , TraningModule:saved_training_module});

    } catch (error) {
        res.status(500).json({ message:"problem in ceating TraningModule " , error:error.message});
    }
}


const getTraningModuleByID = async(req,res)=>{
    try {
        const {id} = req.params;

        const TraningModule = await training_module.findById(id);

        if(!TraningModule)
        {
            return res.status(404).json({ message : "not found"});
        }

        res.status(200).json({message:"getting sussesfully" , TraningModule});

    } catch (error) {
        res.status(500).json({ message:"problem in ceating TraningModule " , error:error.message});
    }
}


const getAllTraningModule = async(req,res)=>{
    try {
        const TraningModule = await training_module.find();

        res.status(200).json({
            message: "Training modules fetched successfully",
            count: TraningModule.length,
            TraningModule
        });

    } catch (error) {
        res.status(500).json({ message:"problem in ceating TraningModule " , error:error.message});
    }
}



const deleteTraningModule = async(req,res)=>{
    try {
        const {id} = req.params;
        const adminid = req.admin.id;

        const TraningModule = await training_module.findOneAndDelete({_id:id,adminid})

        if(!TraningModule)
        {
            return res.status(404).json({ message : "not found to delete"});
        }

        res.status(200).json({message:"deleting sussesfully" , TraningModule});

    } catch (error) {
        res.status(500).json({ message:"problem in ceating TraningModule " , error:error.message});
    }
}


const updateTraningModule = async(req,res)=>{
    try {
        const {id} = req.params;
        const adminid = req.admin.id;
        const {title,description,content,category} = req.body;

        const TraningModule = await training_module.findOneAndUpdate({_id:id,adminid},{$set:{
            title,
            description,
            content,
            category
        }},{
            new:true,
            runValidators:true
        });

        if(!TraningModule)
        {
            return res.status(404).json({ message : "not found to update"});
        }

        res.status(200).json({message:"updating sussesfully" , TraningModule});

    } catch (error) {
        res.status(500).json({ message:"problem in ceating TraningModule " , error:error.message});
    }
}

module.exports={createTraningModule,getTraningModuleByID,getAllTraningModule,deleteTraningModule,updateTraningModule};