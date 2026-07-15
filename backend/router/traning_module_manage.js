const express = require('express');
const router = express.Router();
const featchadmin = require('../middleware/featchadmin');

const {createTraningModule,getTraningModuleByID,getAllTraningModule,deleteTraningModule,updateTraningModule} = require('../controller/training_module');

router.post("/createTraningModule",featchadmin,createTraningModule);

router.get("/getTraningModuleByID/:id",getTraningModuleByID);
router.get("/getAllTraningModule",getAllTraningModule);

router.delete("/deleteTraningModule/:id",featchadmin,deleteTraningModule);

router.put("/updateTraningModule/:id",featchadmin,updateTraningModule);

module.exports = router;