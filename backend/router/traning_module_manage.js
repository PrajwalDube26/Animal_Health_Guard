const express = require('express');
const router = express.Router();
const isadmin = require('../middleware/isadmin')

const {createTraningModule,getTraningModuleByID,getAllTraningModule,deleteTraningModule,updateTraningModule} = require('../controller/training_module');

router.post("/createTraningModule",isadmin,createTraningModule);

router.get("/getTraningModuleByID/:id",getTraningModuleByID);
router.get("/getAllTraningModule",getAllTraningModule);

router.delete("/deleteTraningModule/:id",isadmin,deleteTraningModule);

router.put("/updateTraningModule/:id",isadmin,updateTraningModule);

module.exports = router;