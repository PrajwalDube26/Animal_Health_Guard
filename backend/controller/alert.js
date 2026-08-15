const Alert = require("../models/Alert");


//login required

const create_alert = async(req,res) =>{
    try {
        const {title,message,district,location,farmType,severity} = req.body;
        const adminid = req.admin.id;

        const alert_to_save = new Alert({
            adminid,
            title,
            message,
            district,
            location,
            farmType,
            severity
        });

        const alert = await alert_to_save.save();

        res.status(201).json({message:"alert created successfully",alert});


    } catch (error) {
        res.status(500).json({message:"problem in creating alert",error:error.message});
    }
};


//login required

const get_alert_by_adminid = async(req,res) =>{
    try {
        const adminid = req.admin.id;
        
        const alerts = await Alert.find({adminid});

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



const get_all_alerts = async(req,res) =>{
    try {
        
        const alerts = await Alert.find();

        if(alerts.length === 0)
        {
            return res.status(404).json({message:"alert not found"});
        }

        res.status(200).json({message:"this is array of alerts",alerts});

    } catch (error) {
        res.status(500).json({message:"problem in reading alert",error:error.message});
    }
}


//login required

const delete_alert_by_alertid = async(req,res) =>{
    try {
        const alertid = req.params.id;
        const adminid = req.admin.id;

        const deleted_alert = await Alert.findOneAndDelete({_id:alertid , adminid});

        if(!deleted_alert)
        {
            return res.status(404).json({message:"alert not found"});
        }

        res.status(200).json({message:`this alert is deleted for particular id : ${alertid} and adminid :${adminid} `,alert:deleted_alert});

    } catch (error) {
        res.status(500).json({message:"problem in deleting alert",error:error.message});
    }
}


//login required

const update_alert_by_alertid = async(req,res) =>{
    try {
        const alertid = req.params.id;
        const adminid = req.admin.id;
        const {title,message,district,location,farmType,severity} = req.body;

        const updated_alert = await Alert.findOneAndUpdate({_id:alertid , adminid},{$set:{
            title,
            message,
            district,
            location,
            farmType,
            severity
        }},{
            new:true,
            runValidators:true
        });


        if(!updated_alert)
        {
            return res.status(404).json({message:"alert not found"});
        }

        res.status(200).json({message:`this alert is updated for particular id : ${alertid} and adminid :${adminid} `,alert:updated_alert});

    } catch (error) {
        res.status(500).json({message:"problem in updating alert",error:error.message});
    }
}

module.exports = {create_alert,get_alert_by_adminid,get_alert_by_alertid,get_all_alerts,delete_alert_by_alertid,update_alert_by_alertid};
