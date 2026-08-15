const express = require('express');
const router = express.Router();

const {
    createUserTraning,
    getUserTraningByUserId,
    getUserTraningBytraningId,
    deleteUserTraningByUserId,
    deleteUserTraningBytraningId,
    delete_UserTraning_By_traningId_And_userId
} = require('../controller/user_traninig');
const featchuser = require('../middleware/featchuser');

router.post('/create_user_traning/:traningId', featchuser, createUserTraning);
router.post('/create_user_traning', featchuser, createUserTraning);
router.post('/create_user_training/:trainingId', featchuser, createUserTraning);
router.post('/create_user_training', featchuser, createUserTraning);

router.get('/get_user_traning', featchuser, getUserTraningByUserId);
router.get('/get_user_training', featchuser, getUserTraningByUserId);
router.get('/get_User_Traning_By_UserId', featchuser, getUserTraningByUserId);

router.get('/get_user_traning/:traningId', getUserTraningBytraningId);
router.get('/get_user_training/:trainingId', getUserTraningBytraningId);

router.delete('/delete_user_traning', featchuser, deleteUserTraningByUserId);
router.delete('/delete_user_training', featchuser, deleteUserTraningByUserId);

router.delete('/delete_user_traning/:traningId', featchuser, delete_UserTraning_By_traningId_And_userId);
router.delete('/delete_user_training/:trainingId', featchuser, delete_UserTraning_By_traningId_And_userId);

module.exports = router;