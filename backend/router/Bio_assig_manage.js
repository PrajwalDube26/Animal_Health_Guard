const {submit_assessment,get_assignment_of_admin,assignment_by_id,delete_assignment,update_assignment} = require('../controller/bio_assig');
const featchadmin = require('../middleware/featchadmin');

const express = require('express');
const router = express.Router();

router.post("/submit_assessment",featchadmin,submit_assessment);

router.get("/get_assignment_of_admin",featchadmin,get_assignment_of_admin);
router.get("/assignment_by_id/:id",assignment_by_id);

router.delete("/delete_assignment/:id",featchadmin,delete_assignment);
router.put("/update_assignment/:id",featchadmin,update_assignment);


module.exports=router;