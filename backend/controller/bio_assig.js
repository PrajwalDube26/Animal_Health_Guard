const Biosecurity_Assessment_Models=require('../models/Biosecurity_assessment');

const submit_assessment = async(req,res)=>{
    try {
        const farmId = req.params.farmId;

        const {riskScore,riskLevel} = req.body;

        const assignment_to_save = new Biosecurity_Assessment_Models({
            farmId,
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


const get_assignment_of_farm = async(req,res)=>{
    try {
        const {farmId} = req.params;

        const assignment_of_farmid = await Biosecurity_Assessment_Models.find({farmId});

        if(assignment_of_farmid.length === 0)
        {
            return res.status(404).send({ message:"not found an assignment" });
        }

        res.status(200).send({message:"assignment find succesfully" , assignments:assignment_of_farmid});
    
    } catch (error) {
        res.status(400).send({message:"problem in assignment finding" , error:error});
    }
    
}


const assignment_by_id = async(req,res)=>{
    try {
        const {id}=req.params;

        const assignment_by_id = await Biosecurity_Assessment_Models.findById(id);
        
        if(!assignment_by_id)
        {
            return res.status(404).send({ message:"not found an assignment" });
        }

        res.status(200).send({message:"assignment find succesfully" , assignment:assignment_by_id});

    } 
    catch (error) 
    {
        res.status(400).send({message:"problem in assignment finding" , error:error});
    }

}


const delete_assignment = async(req,res)=>{
    try {
        const {farmId,id} = req.params;

        const deleted_assig = await Biosecurity_Assessment_Models.findOneAndDelete({farmId,_id:id});

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
        const {farmId ,id} = req.params;
        const {riskScore,riskLevel} = req.body;

        const updated_assignment = await Biosecurity_Assessment_Models.findOneAndUpdate({farmId ,_id:id},{$set:{
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


module.exports = {submit_assessment,get_assignment_of_farm,assignment_by_id,delete_assignment,update_assignment};