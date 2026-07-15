const express=require('express');
const router=express.Router();

const {createUserAlert,getUserAlertByUserId,getUserAlertByalertId,deleteUserAlertByUserId, deleteUserAlertByalertId, delete_UserAlert_By_alertId_And_userId} = require('../controller/user_alert')
const featchuser = require('../middleware/featchuser');


router.post('/create_User_Alert',featchuser,createUserAlert);

router.get('/get_User_Alert_By_UserId',featchuser,getUserAlertByUserId);
router.get('/get_User_Alert_By_alertId/:traningId',getUserAlertByalertId);

router.delete('/delete_User_Alert_By_UserId',featchuser,deleteUserAlertByUserId);
router.delete('/delete_User_Alert_By_alertId/:traningId',deleteUserAlertByalertId);
router.delete('/delete_user_alert/:traningId',featchuser,delete_UserAlert_By_alertId_And_userId);
    
module.exports=router;