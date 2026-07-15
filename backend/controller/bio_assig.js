const Biosecurity_Assessment_Models=require('../models/Biosecurity_assessment');

const submit_assessment = async(req,res)=>{
    try {
        const adminid = req.admin.id;

        const {riskScore,riskLevel} = req.body;

        const assignment_to_save = new Biosecurity_Assessment_Models({
            adminid,
            riskScore,
            riskLevel
        });

        const saved_assignment = await assignment_to_save.save();

        res.status(201).send({message:"assignment added succesfully" , assignment:saved_assignment})

    } 
    catch (error) {
        res.status(400).send({message:"problem in assignment adding" , error:error});
    }
}


const get_assignment_of_admin = async(req,res)=>{
    try {
        const adminid = req.admin.id;

        const assignment_of_adminid = await Biosecurity_Assessment_Models.find({adminid});

        if(assignment_of_adminid.length === 0)
        {
            return res.status(404).send({ message:"not found an assignment" });
        }

        res.status(200).send({message:"assignment find succesfully" , assignments:assignment_of_adminid});
    
    } catch (error) {
        res.status(400).send({message:"problem in assignment finding" , error:error});
    }
    
}


const assignment_by_id = async(req,res)=>{
    try {
        const {id}=req.params;

        const assignment_byId = await Biosecurity_Assessment_Models.findById(id);
        
        if(!assignment_byId)
        {
            return res.status(404).send({ message:"not found an assignment" });
        }

        res.status(200).send({message:"assignment find succesfully" , assignment:assignment_byId});

    } 
    catch (error) 
    {
        res.status(400).send({message:"problem in assignment finding" , error:error});
    }

}


const delete_assignment = async(req,res)=>{
    try {
        const {id} = req.params;
        const adminid = req.admin.id;

        const deleted_assig = await Biosecurity_Assessment_Models.findOneAndDelete({adminid,_id:id});

        if(!deleted_assig)
        {
            return res.status(404).json({ message:"not found to delete"});
        }

        res.status(200).json({ message:"deleting succesfully ",assignment:deleted_assig });


    } 
    catch (error) 
    {
        res.status(500).json({ message : "some problem occure in deleting" , error:error.message})
    }
    
}


const update_assignment = async(req,res)=>{

    try {
        const {id} = req.params;
        const adminid = req.admin.id;
        const {riskScore,riskLevel} = req.body;

        const updated_assignment = await Biosecurity_Assessment_Models.findOneAndUpdate({adminid ,_id:id},{$set:{
            riskScore,
            riskLevel
        }},{
            new:true,
            runValidators:true
        });

        if(!updated_assignment)
        {
            return res.status(404).json({ message:"not found to delete"});
        }

        res.status(200).json({ message:"updating succesfully ",assignment:updated_assignment });

    } 
    catch (error) 
    {
        res.status(500).json({ message : "some problem occure in deleting" , error:error.message})
    }

    
}


module.exports = {submit_assessment,get_assignment_of_admin,assignment_by_id,delete_assignment,update_assignment};