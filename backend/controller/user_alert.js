const Useralert = require('../models/User_Alert');

const createUserAlert = async(req,res)=>{
    try {
        const {alertId} = req.params;
        const userId = req.user.id;

        const existing = await Useralert.findOne({
            userId,
            alertId
        });

        if(existing){
            return res.status(409).json({
                message: "Training already assigned to this user"
            });
        }

        const userAlertToSave = new Useralert({
            userId,
            alertId
        })

        const savedUserAlert = await userAlertToSave.save();

        res.status(201).json({message:"saved sussesfully" , userAlert:savedUserAlert});
    } catch (error) {
        res.status(500).json({ message:"problem is creating userAlert" , error:error.message});
    }
}




const getUserAlertByUserId = async(req,res)=>{  // add populate if required
    try {
        const userId = req.user.id;

        const userAlert = await Useralert.find({userId});

        if(userAlert.length === 0)
        {
            return res.status(404).json({ message:"not found"});
        }

        res.status(200).json({message:"getting userAlert sussesfully" , userAlert});
    } catch (error) {
        res.status(500).json({ message:"problem is getting userAlert" , error:error.message});
    }
}



const getUserAlertByalertId = async(req,res)=>{ // add populate if required
    try {
        const {alertId} = req.params;

        const userAlert = await Useralert.find({alertId});

        if(userAlert.length === 0)
        {
            return res.status(404).json({ message:"not found"});
        }

        res.status(200).json({message:"getting userAlert sussesfully" , userAlert});

    } catch (error) {
        res.status(500).json({ message:"problem is geting userAlert" , error:error.message});
    }
}





const deleteUserAlertByUserId = async(req,res)=>{
    try {
        const userId = req.user.id;

        const userAlert = await Useralert.deleteMany({userId});

        if(userAlert.deletedCount === 0)
        {
            return res.status(404).json({ message:"not found to delete"});
        }

        res.status(200).json({message:"deleting userAlert sussesfully" , userAlert});
    } catch (error) {
        res.status(500).json({ message:"problem is deleting userAlert" , error:error.message});
    }
}



const deleteUserAlertByalertId = async(req,res)=>{
    try {
        const {alertId} = req.params;

        const userAlert = await Useralert.deleteMany({alertId});

        if(userAlert.deletedCount === 0)
        {
            return res.status(404).json({ message:"not found to delete"});
        }

        res.status(200).json({message:"deleting userAlert sussesfully" , userAlert});
    } catch (error) {
        res.status(500).json({ message:"problem is deleting userAlert" , error:error.message});
    }
}


const delete_UserAlert_By_alertId_And_userId = async(req,res)=>{
    try {
        const {alertId} = req.params;
        const userId = req.user.id;

        const userAlert = await Useralert.findOneAndDelete({alertId, userId});

        if(!userAlert)
        {
            return res.status(404).json({ message:"not found to delete"});
        }

        res.status(200).json({message:"deleting userAlert sussesfully" , userAlert});
    } catch (error) {
        res.status(500).json({ message:"problem is deleting userAlert" , error:error.message});
    }
}


module.exports = {createUserAlert,getUserAlertByUserId,getUserAlertByalertId,deleteUserAlertByUserId, deleteUserAlertByalertId, delete_UserAlert_By_alertId_And_userId };