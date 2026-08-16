const express = require('express');
const router = express.Router();
const featchadmin = require('../middleware/featchadmin');

const {
    submit_assessment,
    get_assignment_of_admin,
    assignment_by_id,
    get_all_assessments,
    get_assessments_by_farmtype,
    delete_assignment,
    update_assignment,
    add_question_to_assessment,
    delete_question_from_assessment
} = require('../controller/bio_assig');

// Assessment CRUD
router.post("/submit_assessment", featchadmin, submit_assessment);
router.post("/create_assessment", featchadmin, submit_assessment);

router.get("/get_assignment_of_admin", featchadmin, get_assignment_of_admin);
router.get("/get_assessments_by_admin", featchadmin, get_assignment_of_admin);

router.get("/get_all_assessments", get_all_assessments);

// FarmType specific route
router.get("/get_assessments_by_farmtype/:farmType", get_assessments_by_farmtype);
router.get("/farmtype/:farmType", get_assessments_by_farmtype);

router.get("/assignment_by_id/:id", assignment_by_id);
router.get("/get_assessment_by_id/:id", assignment_by_id);

router.delete("/delete_assignment/:id", featchadmin, delete_assignment);
router.delete("/delete_assessment/:id", featchadmin, delete_assignment);

router.put("/update_assignment/:id", featchadmin, update_assignment);
router.put("/update_assessment/:id", featchadmin, update_assignment);

// Question-level nested helpers within Assessment
router.post("/add_question/:id", featchadmin, add_question_to_assessment);
router.delete("/delete_question/:id/:questionId", featchadmin, delete_question_from_assessment);

module.exports = router;