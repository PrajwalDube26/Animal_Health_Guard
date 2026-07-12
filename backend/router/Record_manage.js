const express = require('express');
const router = express.Router();

const {create_record,get_record_by_farmId,get_record_by_recordId,delete_record,update_record} = require('../controller/record');
const featchuser = require('../middleware/featchuser');

router.post("/create_record/:farmId",featchuser,create_record);

router.get("/get_record_by_farmId/:farmId",featchuser,get_record_by_farmId);
router.get("/get_record_by_recordId/:id",featchuser,get_record_by_recordId);

router.delete("/delete_record/:farmId/:id",featchuser,delete_record);

router.put("/update_record/:farmId/:id",featchuser,update_record);

module.exports = router;