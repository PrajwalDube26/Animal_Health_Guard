const Useralert = require('../models/User_Alert');

const createUserAlert = async (req, res) => {
    try {
        const alertId = req.params.alertId || req.body.alertId;
        const userId = req.user.id;

        if (!alertId) {
            return res.status(400).json({ message: "Alert ID is required" });
        }

        const existing = await Useralert.findOne({
            userId,
            alertId
        });

        if (existing) {
            return res.status(409).json({
                message: "Alert already marked as read by this user",
                userAlert: existing
            });
        }

        const userAlertToSave = new Useralert({
            userId,
            alertId
        });

        const savedUserAlert = await userAlertToSave.save();

        res.status(201).json({ message: "Alert marked as read successfully", userAlert: savedUserAlert });
    } catch (error) {
        res.status(500).json({ message: "Problem in creating userAlert", error: error.message });
    }
};

const getUserAlertByUserId = async (req, res) => {
    try {
        const userId = req.user.id;

        const userAlert = await Useralert.find({ userId }).populate('alertId');

        if (userAlert.length === 0) {
            return res.status(404).json({ message: "No read alerts found", userAlert: [] });
        }

        res.status(200).json({ message: "Getting userAlert successfully", userAlert });
    } catch (error) {
        res.status(500).json({ message: "Problem in getting userAlert", error: error.message });
    }
};

const getUserAlertByalertId = async (req, res) => {
    try {
        const { alertId } = req.params;

        const userAlert = await Useralert.find({ alertId }).populate('userId');

        if (userAlert.length === 0) {
            return res.status(404).json({ message: "Not found", userAlert: [] });
        }

        res.status(200).json({ message: "Getting userAlert successfully", userAlert });
    } catch (error) {
        res.status(500).json({ message: "Problem in getting userAlert", error: error.message });
    }
};

const deleteUserAlertByUserId = async (req, res) => {
    try {
        const userId = req.user.id;

        const userAlert = await Useralert.deleteMany({ userId });

        if (userAlert.deletedCount === 0) {
            return res.status(404).json({ message: "Not found to delete" });
        }

        res.status(200).json({ message: "Deleted userAlert successfully", userAlert });
    } catch (error) {
        res.status(500).json({ message: "Problem in deleting userAlert", error: error.message });
    }
};

const deleteUserAlertByalertId = async (req, res) => {
    try {
        const { alertId } = req.params;

        const userAlert = await Useralert.deleteMany({ alertId });

        if (userAlert.deletedCount === 0) {
            return res.status(404).json({ message: "Not found to delete" });
        }

        res.status(200).json({ message: "Deleted userAlert successfully", userAlert });
    } catch (error) {
        res.status(500).json({ message: "Problem in deleting userAlert", error: error.message });
    }
};

const delete_UserAlert_By_alertId_And_userId = async (req, res) => {
    try {
        const alertId = req.params.alertId || req.params.id;
        const userId = req.user.id;

        const userAlert = await Useralert.findOneAndDelete({ alertId, userId });

        if (!userAlert) {
            return res.status(404).json({ message: "Not found to delete" });
        }

        res.status(200).json({ message: "Deleted userAlert successfully", userAlert });
    } catch (error) {
        res.status(500).json({ message: "Problem in deleting userAlert", error: error.message });
    }
};

module.exports = {
    createUserAlert,
    getUserAlertByUserId,
    getUserAlertByalertId,
    deleteUserAlertByUserId,
    deleteUserAlertByalertId,
    delete_UserAlert_By_alertId_And_userId
};