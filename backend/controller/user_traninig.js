const Usertraning = require('../models/User_Traning');

// Create User Training / Enroll
const createUserTraning = async (req, res) => {
    try {
        const traningId = req.params.traningId || req.params.trainingId || req.body.traningId || req.body.trainingId;
        const userId = req.user.id;

        if (!traningId) {
            return res.status(400).json({ message: "Training ID is required" });
        }

        const existing = await Usertraning.findOne({
            userId,
            traningId
        });

        if (existing) {
            return res.status(409).json({
                message: "Training already assigned/enrolled for this user",
                userTraning: existing
            });
        }

        const userTraningToSave = new Usertraning({
            userId,
            traningId
        });

        const savedUserTraning = await userTraningToSave.save();

        res.status(201).json({ message: "Enrolled in training successfully", userTraning: savedUserTraning });
    } catch (error) {
        res.status(500).json({ message: "Problem in creating UserTraning", error: error.message });
    }
};

// Get User Trainings for logged-in user
const getUserTraningByUserId = async (req, res) => {
    try {
        const userId = req.user.id;

        const userTraning = await Usertraning.find({ userId }).populate('traningId');

        if (userTraning.length === 0) {
            return res.status(200).json({ message: "No enrolled trainings found", userTraning: [] });
        }

        res.status(200).json({ message: "Getting userTraning successfully", userTraning });
    } catch (error) {
        res.status(500).json({ message: "Problem in getting UserTraning", error: error.message });
    }
};

// Get User Training by training ID
const getUserTraningBytraningId = async (req, res) => {
    try {
        const traningId = req.params.traningId || req.params.trainingId;

        const userTraning = await Usertraning.find({ traningId }).populate('userId');

        if (userTraning.length === 0) {
            return res.status(200).json({ message: "No users found for this training", userTraning: [] });
        }

        res.status(200).json({ message: "Getting userTraning successfully", userTraning });
    } catch (error) {
        res.status(500).json({ message: "Problem in getting UserTraning", error: error.message });
    }
};

// Delete all User Training assignments for logged-in user
const deleteUserTraningByUserId = async (req, res) => {
    try {
        const userId = req.user.id;

        const userTraning = await Usertraning.deleteMany({ userId });

        if (userTraning.deletedCount === 0) {
            return res.status(404).json({ message: "Not found to delete" });
        }

        res.status(200).json({ message: "Deleted userTraning successfully", userTraning });
    } catch (error) {
        res.status(500).json({ message: "Problem in deleting UserTraning", error: error.message });
    }
};

// Delete User Training by training ID
const deleteUserTraningBytraningId = async (req, res) => {
    try {
        const traningId = req.params.traningId || req.params.trainingId;

        const userTraning = await Usertraning.deleteMany({ traningId });

        if (userTraning.deletedCount === 0) {
            return res.status(404).json({ message: "Not found to delete" });
        }

        res.status(200).json({ message: "Deleted userTraning successfully", userTraning });
    } catch (error) {
        res.status(500).json({ message: "Problem in deleting UserTraning", error: error.message });
    }
};

// Delete User Training by training ID and logged-in user ID (Unenroll)
const delete_UserTraning_By_traningId_And_userId = async (req, res) => {
    try {
        const traningId = req.params.traningId || req.params.trainingId || req.params.id;
        const userId = req.user.id;

        const userTraning = await Usertraning.findOneAndDelete({ traningId, userId });

        if (!userTraning) {
            return res.status(404).json({ message: "Not found to delete" });
        }

        res.status(200).json({ message: "Unenrolled from training successfully", userTraning });
    } catch (error) {
        res.status(500).json({ message: "Problem in deleting UserTraning", error: error.message });
    }
};

module.exports = {
    createUserTraning,
    getUserTraningByUserId,
    getUserTraningBytraningId,
    deleteUserTraningByUserId,
    deleteUserTraningBytraningId,
    delete_UserTraning_By_traningId_And_userId
};