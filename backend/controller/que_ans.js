const Questions_Answers = require('../models/Questions_Answers');

const createQuestionsAnswer=async(req,res)=>{
    try {
        const {question,answer} = req.body;
        const {assignment_id} = req.params;

        if (!question || !answer) {
            return res.status(400).json({
                message: "Question and Answer are required"
            });
        }

        const que_ans_to_save = new Questions_Answers({
            assignment_id,
            question,
            answer
        });

        const saved_que_ans = await que_ans_to_save.save();

        if(!saved_que_ans)
        {
            return res.status(400).json({ message : "not saved"});
        }

        res.status(201).json({message:"created sussesfully" , QuestionsAnswer:saved_que_ans});


    } catch (error) {
        res.status(500).json({message:"problem in creating Questions-Answers",error:error.message});
    }
}

const getQuestionsAnswerByAssignId=async(req,res)=>{
    try {
        const {assignment_id} = req.params;

        const QuestionsAnswer = await Questions_Answers.find({assignment_id});

        if(QuestionsAnswer.length === 0)
        {
            return res.status(404).json({message:"Not found for this assignment_id"});
        }

        res.status(200).json({message:"found successfully" , QuestionsAnswer});
    } catch (error) {
        res.status(500).json({message:"problem in getting Questions-Answers",error:error.message});
    }
}

const getQuestionsAnswerByID=async(req,res)=>{
    try {
        const {id} = req.params;

        const QuestionsAnswer = await Questions_Answers.findById(id);

        if(!QuestionsAnswer)
        {
            return res.status(404).json({message:"Not found for this assignment_id"});
        }

        res.status(200).json({message:"found successfully" , QuestionsAnswer});
    } catch (error) {
        res.status(500).json({message:"problem in getting Questions-Answers",error:error.message});
    }
}

const deleteQuestionsAnswer=async(req,res)=>{
    try {
        const {id,assignment_id} = req.params;

        const QuestionsAnswer = await Questions_Answers.findOneAndDelete({_id:id,assignment_id})

        if(!QuestionsAnswer)
        {
            return res.status(404).json({message:"Not found for deletion"});
        }

        res.status(200).json({message:"delete successfully" , QuestionsAnswer});
    } catch (error) {
        res.status(500).json({message:"problem in deleting Questions-Answers",error:error.message});
    }
}

const updateQuestionsAnswer=async(req,res)=>{
    try {
        const {id,assignment_id} = req.params;
        const {question,answer} = req.body;
        
        if (!question || !answer) {
            return res.status(400).json({
                message: "Question and Answer are required"
            });
        }

        const QuestionsAnswer = await Questions_Answers.findOneAndUpdate({_id:id,assignment_id},{$set:{
            question,
            answer
        }},{
            new:true,
            runValidators:true
        })

        if(!QuestionsAnswer)
        {
            return res.status(404).json({message:"Not found for update"});
        }

        res.status(200).json({message:"update successfully" , QuestionsAnswer});
    } catch (error) {
        res.status(500).json({message:"problem in updating Questions-Answers" , error:error.message});
    }
}

module.exports = {createQuestionsAnswer,getQuestionsAnswerByAssignId,getQuestionsAnswerByID,deleteQuestionsAnswer,updateQuestionsAnswer};