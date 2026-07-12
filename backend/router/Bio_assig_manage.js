const {submit_assessment,get_assignment_of_farm,assignment_by_id,delete_assignment,update_assignment} = require('../controller/bio_assig');

const express = require('express');
const router = express.Router();

router.post("/submit_assessment/:farmId",submit_assessment);

router.get("/get_assignment_of_farm/:farmId",get_assignment_of_farm);
router.get("/assignment_by_id/:id",assignment_by_id);

router.delete("/delete_assignment/:farmId/:id",delete_assignment);
router.put("/update_assignment/:farmId/:id",update_assignment);


module.exports=router;