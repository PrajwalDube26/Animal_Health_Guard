const express =require('express');
const {createQuestionsAnswer,getQuestionsAnswerByAssignId,getQuestionsAnswerByID,deleteQuestionsAnswer,updateQuestionsAnswer} = require('../controller/que_ans');

const router = express.Router();

router.post("/createQuestionsAnswer/:assignment_id",createQuestionsAnswer);

router.get("/getQuestionsAnswerByAssignId/:assignment_id",getQuestionsAnswerByAssignId);
router.get("/getQuestionsAnswerByID/:id",getQuestionsAnswerByID);

router.delete("/deleteQuestionsAnswer/:assignment_id/:id",deleteQuestionsAnswer);
router.put("/updateQuestionsAnswer/:assignment_id/:id",updateQuestionsAnswer);

module.exports = router;