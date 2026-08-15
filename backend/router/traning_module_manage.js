const express = require('express');
const router = express.Router();
const featchadmin = require('../middleware/featchadmin');

const {
    createTraningModule,
    getTraningModuleByID,
    getAllTraningModule,
    getTraningModuleByAdminID,
    deleteTraningModule,
    updateTraningModule
} = require('../controller/training_module');

// Admin Endpoints
router.post("/createTraningModule", featchadmin, createTraningModule);
router.post("/create_traning_module", featchadmin, createTraningModule);

router.get("/getTraningModuleByAdminID", featchadmin, getTraningModuleByAdminID);
router.get("/get_traning_module_by_adminid", featchadmin, getTraningModuleByAdminID);

router.delete("/deleteTraningModule/:id", featchadmin, deleteTraningModule);
router.delete("/delete_traning_module/:id", featchadmin, deleteTraningModule);

router.put("/updateTraningModule/:id", featchadmin, updateTraningModule);
router.put("/update_traning_module/:id", featchadmin, updateTraningModule);

// Public / User Endpoints
router.get("/getTraningModuleByID/:id", getTraningModuleByID);
router.get("/get_traning_module_by_id/:id", getTraningModuleByID);

router.get("/getAllTraningModule", getAllTraningModule);
router.get("/get_all_traning_module", getAllTraningModule);

module.exports = router;