const Record = require('../models/Record');

const create_record = async(req,res) =>{
    try {
        const {type,description,date} = req.body;
        const farmId = req.params.farmId;

        const new_record = new Record({
            farmId,
            type,
            description,
            date

        });

        const saved_record = await new_record.save();

        res.status(201).json({message:"record creaed successfully",record:saved_record});
        
    } catch (error) {
        res.status(500).json({message:"problem in creating record",error:error.message});
    }
}


const get_record_by_farmId = async(req,res) =>{
    try {
        const farmId = req.params.farmId;

        const records = await Record.find({farmId});

        if(records.length === 0)
        {
            return res.status(404).json({message:"record not found"});
        }

        res.status(200).json({message:"record found successfully",records});

    } catch (error) {
        res.status(500).json({message:"problem in finding record by farmid",error:error.message});
    }
}


const get_record_by_recordId = async(req,res) =>{
    try {
        const id = req.params.id;

        const record = await Record.findById(id);

        if(!record)
        {
            return res.status(404).json({message:"record not found"});
        }

        res.status(200).json({message:"record found successfully",record});

    } catch (error) {
        res.status(500).json({message:"problem in finding record by id",error:error.message});
    }
}


const delete_record = async(req,res) =>{
    try {
        const farmId = req.params.farmId;
        const id = req.params.id;

        const record = await Record.findOneAndDelete({_id:id,farmId});

        if(!record)
        {
            return res.status(404).json({message:"record not found to delete"});
        }

        res.status(200).json({message:"record deleted successfully",record});

    } catch (error) {
        res.status(500).json({message:"problem in deleting record",error:error.message});
    }
}



const update_record = async(req,res) =>{
    try {
        const farmId = req.params.farmId;
        const id = req.params.id;
        const {type,description,date} = req.body;

        const record = await Record.findOneAndUpdate({_id:id,farmId},{$set:{
            type,
            description,
            date
        }},{
            new:true,
            runValidators:true
        });

        if(!record)
        {
            return res.status(404).json({message:"record not found to update"});
        }

        res.status(200).json({message:"record updated successfully",record});
    } catch (error) {
        res.status(500).json({message:"problem in updating record",error:error.message});
    }
}



module.exports = {create_record,get_record_by_farmId,get_record_by_recordId,delete_record,update_record};