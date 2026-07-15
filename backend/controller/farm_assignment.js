const FarmAssignment = require('../models/Farm_assignment');


// Create Farm Assignment
const createFarmAssignment = async (req, res) => {
    try {
        const { farmId, assignment_id } = req.params;

        const existing = await FarmAssignment.findOne({
            farmId,
            assignment_id
        });

        if (existing) {
            return res.status(409).json({
                message: "Assignment already linked with this farm"
            });
        }

        const farmAssignmentToSave = new FarmAssignment({
            farmId,
            assignment_id
        });

        const savedFarmAssignment = await farmAssignmentToSave.save();

        res.status(201).json({
            message: "Farm Assignment created successfully",
            farmAssignment: savedFarmAssignment
        });

    } catch (error) {
        res.status(500).json({
            message: "Problem creating Farm Assignment",
            error: error.message
        });
    }
};


// Get Assignment by Farm ID
const getFarmAssignmentByFarmId = async (req, res) => {
    try {
        const { farmId } = req.params;

        const farmAssignment = await FarmAssignment.find({ farmId });

        if (farmAssignment.length === 0) {
            return res.status(404).json({
                message: "No assignments found"
            });
        }

        res.status(200).json({
            message: "Farm Assignments fetched successfully",
            farmAssignment
        });

    } catch (error) {
        res.status(500).json({
            message: "Problem getting Farm Assignments",
            error: error.message
        });
    }
};


// Get Farms by Assignment ID
const getFarmAssignmentByAssignmentId = async (req, res) => {
    try {
        const { assignment_id } = req.params;

        const farmAssignment = await FarmAssignment.find({ assignment_id });

        if (farmAssignment.length === 0) {
            return res.status(404).json({
                message: "No farms found"
            });
        }

        res.status(200).json({
            message: "Farm Assignments fetched successfully",
            farmAssignment
        });

    } catch (error) {
        res.status(500).json({
            message: "Problem getting Farm Assignments",
            error: error.message
        });
    }
};


// Delete all assignments of a farm
const deleteFarmAssignmentByFarmId = async (req, res) => {
    try {
        const { farmId } = req.params;

        const farmAssignment = await FarmAssignment.deleteMany({ farmId });

        if (farmAssignment.deletedCount === 0) {
            return res.status(404).json({
                message: "Nothing found to delete"
            });
        }

        res.status(200).json({
            message: "Farm Assignments deleted successfully",
            farmAssignment
        });

    } catch (error) {
        res.status(500).json({
            message: "Problem deleting Farm Assignments",
            error: error.message
        });
    }
};


// Delete all farms linked with an assignment
const deleteFarmAssignmentByAssignmentId = async (req, res) => {
    try {
        const { assignment_id } = req.params;

        const farmAssignment = await FarmAssignment.deleteMany({
            assignment_id
        });

        if (farmAssignment.deletedCount === 0) {
            return res.status(404).json({
                message: "Nothing found to delete"
            });
        }

        res.status(200).json({
            message: "Farm Assignments deleted successfully",
            farmAssignment
        });

    } catch (error) {
        res.status(500).json({
            message: "Problem deleting Farm Assignments",
            error: error.message
        });
    }
};


// Delete one specific Farm-Assignment relation
const deleteFarmAssignment = async (req, res) => {
    try {
        const { farmId, assignment_id } = req.params;

        const farmAssignment = await FarmAssignment.findOneAndDelete({
            farmId,
            assignment_id
        });

        if (!farmAssignment) {
            return res.status(404).json({
                message: "Relation not found"
            });
        }

        res.status(200).json({
            message: "Farm Assignment deleted successfully",
            farmAssignment
        });

    } catch (error) {
        res.status(500).json({
            message: "Problem deleting Farm Assignment",
            error: error.message
        });
    }
};


module.exports = {
    createFarmAssignment,
    getFarmAssignmentByFarmId,
    getFarmAssignmentByAssignmentId,
    deleteFarmAssignmentByFarmId,
    deleteFarmAssignmentByAssignmentId,
    deleteFarmAssignment
};