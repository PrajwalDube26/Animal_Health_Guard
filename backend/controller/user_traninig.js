const Usertraning = require('../models/User_Traning');

const createUserTraning = async(req,res)=>{
    try {
        const {traningId} = req.params;
        const userId = req.user.id;

        const existing = await Usertraning.findOne({
            userId,
            traningId
        });

        if(existing){
            return res.status(409).json({
                message: "Training already assigned to this user"
            });
        }

        const userTraningToSave = new Usertraning({
            userId,
            traningId
        })

        const savedUserTraning = await userTraningToSave.save();

        res.status(201).json({message:"saved sussesfully" , userTraning:savedUserTraning});
    } catch (error) {
        res.status(500).json({ message:"problem is creating UserTraning" , error:error.message});
    }
}




const getUserTraningByUserId = async(req,res)=>{  // add populate if required
    try {
        const userId = req.user.id;

        const userTraning = await Usertraning.find({userId});

        if(userTraning.length === 0)
        {
            return res.status(404).json({ message:"not found"});
        }

        res.status(200).json({message:"getting userTraning sussesfully" , userTraning});
    } catch (error) {
        res.status(500).json({ message:"problem is getting UserTraning" , error:error.message});
    }
}



const getUserTraningBytraningId = async(req,res)=>{ // add populate if required
    try {
        const {traningId} = req.params;

        const userTraning = await Usertraning.find({traningId});

        if(userTraning.length === 0)
        {
            return res.status(404).json({ message:"not found"});
        }

        res.status(200).json({message:"getting userTraning sussesfully" , userTraning});

    } catch (error) {
        res.status(500).json({ message:"problem is geting UserTraning" , error:error.message});
    }
}





const deleteUserTraningByUserId = async(req,res)=>{
    try {
        const userId = req.user.id;

        const userTraning = await Usertraning.deleteMany({userId});

        if(userTraning.deletedCount === 0)
        {
            return res.status(404).json({ message:"not found to delete"});
        }

        res.status(200).json({message:"deleting userTraning sussesfully" , userTraning});
    } catch (error) {
        res.status(500).json({ message:"problem is deleting UserTraning" , error:error.message});
    }
}



const deleteUserTraningBytraningId = async(req,res)=>{
    try {
        const {traningId} = req.params;

        const userTraning = await Usertraning.deleteMany({traningId});

        if(userTraning.deletedCount === 0)
        {
            return res.status(404).json({ message:"not found to delete"});
        }

        res.status(200).json({message:"deleting userTraning sussesfully" , userTraning});
    } catch (error) {
        res.status(500).json({ message:"problem is deleting UserTraning" , error:error.message});
    }
}


const delete_UserTraning_By_traningId_And_userId = async(req,res)=>{
    try {
        const {traningId} = req.params;
        const userId = req.user.id;

        const userTraning = await Usertraning.findOneAndDelete({traningId, userId});

        if(!userTraning)
        {
            return res.status(404).json({ message:"not found to delete"});
        }

        res.status(200).json({message:"deleting userTraning sussesfully" , userTraning});
    } catch (error) {
        res.status(500).json({ message:"problem is deleting UserTraning" , error:error.message});
    }
}


module.exports = {createUserTraning,getUserTraningByUserId,getUserTraningBytraningId,deleteUserTraningByUserId, deleteUserTraningBytraningId, delete_UserTraning_By_traningId_And_userId };