const express = require('express');

const router = express.Router();

const {create_farm,get_farm_by_Userid,get_farm_by_id,update_farm,delete_farm} = require('../controller/farm');

const featchuser = require('../middleware/featchuser');


router.post("/create_farm",featchuser,create_farm);

router.get("/get_farm_by_Userid",featchuser,get_farm_by_Userid);
router.get("/get_farm_by_id/:id",featchuser,get_farm_by_id);

router.put("/update_farm/:id",featchuser,update_farm);

router.delete("/delete_farm/:id",featchuser,delete_farm);

module.exports = router;