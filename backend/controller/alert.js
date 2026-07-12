const Alert = require("../models/Alert");


//login required

const create_alert = async(req,res) =>{
    try {
        const {title,message,location,diseaseType,severity} = req.body;
        const userid = req.user.id;

        const alert_to_save = new Alert({
            userid,
            title,
            message,
            location,
            diseaseType,
            severity
        });

        const alert = await alert_to_save.save();

        res.status(201).json({message:"alert created successfully",alert});


    } catch (error) {
        res.status(500).json({message:"problem in creating alert",error:error.message});
    }
};


//login required

const get_alert_by_userid = async(req,res) =>{
    try {
        const userid = req.user.id;
        
        const alerts = await Alert.find({userid});

        if(alerts.length === 0)
        {
            return res.status(404).json({message:"alert not found"});
        }

        res.status(200).json({message:"this is array of alerts",alerts});

    } catch (error) {
        res.status(500).json({message:"problem in reading alert",error:error.message});
    }
}



const get_alert_by_alertid = async(req,res) =>{
    try {
        const alertid = req.params.id;
        
        const alert = await Alert.findOne({ _id:alertid });

        if(!alert)
        {
            return res.status(404).json({message:"alert not found"});
        }

        res.status(200).json({message:`this is alerts for particular id : ${alertid} `,alert});

    } catch (error) {
        res.status(500).json({message:"problem in reading alert",error:error.message});
    }
}


//login required

const delete_alert_by_alertid = async(req,res) =>{
    try {
        const alertid = req.params.id;
        const userid = req.user.id;

        const deleted_alert = await Alert.findOneAndDelete({_id:alertid , userid});

        if(!deleted_alert)
        {
            return res.status(404).json({message:"alert not found"});
        }

        res.status(200).json({message:`this alert is deleted for particular id : ${alertid} and userid :${userid} `,alert:deleted_alert});

    } catch (error) {
        res.status(500).json({message:"problem in deleting alert",error:error.message});
    }
}


//login required

const update_alert_by_alertid = async(req,res) =>{
    try {
        const alertid = req.params.id;
        const userid = req.user.id;
        const {title,message,location,diseaseType,severity} = req.body;

        const updated_alert = await Alert.findOneAndUpdate({_id:alertid , userid},{$set:{
            title,
            message,
            location,
            diseaseType,
            severity
        }},{
            new:true,
            runValidators:true
        });


        if(!updated_alert)
        {
            return res.status(404).json({message:"alert not found"});
        }

        res.status(200).json({message:`this alert is updated for particular id : ${alertid} and userid :${userid} `,alert:updated_alert});

    } catch (error) {
        res.status(500).json({message:"problem in updating alert",error:error.message});
    }
}

module.exports = {create_alert,get_alert_by_userid,get_alert_by_alertid,delete_alert_by_alertid,update_alert_by_alertid};
