const FarmAssignment = require('../models/Farm_assignment');
const BiosecurityAssessment = require('../models/Biosecurity_assessment');

// Helper to format answers into [{ answer: Boolean }]
const formatAnswers = (answers) => {
    if (!Array.isArray(answers)) return [];
    return answers.map((item) => {
        if (typeof item === 'boolean') {
            return { answer: item };
        } else if (item && typeof item === 'object') {
            return { answer: Boolean(item.answer) };
        }
        return { answer: Boolean(item) };
    });
};

// Helper to compute farmer score percentage based on benchmark answers
const calculateScorePercentage = async (assignment_id, formattedAnswers, providedScore) => {
    if (providedScore !== undefined && !isNaN(Number(providedScore))) {
        return Math.min(100, Math.max(0, Math.round(Number(providedScore))));
    }

    if (formattedAnswers.length === 0) return 0;

    try {
        const benchmark = await BiosecurityAssessment.findById(assignment_id);
        if (benchmark && Array.isArray(benchmark.question_answer) && benchmark.question_answer.length > 0) {
            let matches = 0;
            const total = benchmark.question_answer.length;
            benchmark.question_answer.forEach((q, idx) => {
                const farmerAns = formattedAnswers[idx];
                if (farmerAns && farmerAns.answer === q.answer) {
                    matches++;
                }
            });
            return Math.round((matches / total) * 100);
        }
    } catch (err) {
        console.error("Error fetching benchmark for score calculation:", err);
    }

    // Fallback: percentage of compliant (true) answers
    const passed = formattedAnswers.filter((a) => a.answer === true).length;
    return Math.round((passed / formattedAnswers.length) * 100);
};

// Create or Submit Farm Assignment
const createFarmAssignment = async (req, res) => {
    try {
        const farmId = req.params.farmId || req.body.farmId;
        const assignment_id = req.params.assignment_id || req.body.assignment_id;
        const { farmer_answer, admin_answer, farmer_score_percentage } = req.body;

        if (!farmId || !assignment_id) {
            return res.status(400).json({
                message: "farmId and assignment_id are required"
            });
        }

        const formattedFarmerAnswers = formatAnswers(farmer_answer);
        let formattedAdminAnswers = [];

        // If admin_answer is passed directly, use it; otherwise fetch from BiosecurityAssessment benchmark
        if (admin_answer !== undefined && Array.isArray(admin_answer)) {
            formattedAdminAnswers = formatAnswers(admin_answer);
        } else {
            const benchmark = await BiosecurityAssessment.findById(assignment_id);
            if (benchmark && Array.isArray(benchmark.question_answer)) {
                formattedAdminAnswers = benchmark.question_answer.map((q) => ({
                    answer: Boolean(q.answer)
                }));
            }
        }

        const computedScore = await calculateScorePercentage(
            assignment_id,
            formattedFarmerAnswers,
            farmer_score_percentage
        );

        // Check if existing record exists (upsert/update or create)
        let existing = await FarmAssignment.findOne({ farmId, assignment_id });

        if (existing) {
            existing.farmer_answer = formattedFarmerAnswers;
            if (formattedAdminAnswers.length > 0) {
                existing.admin_answer = formattedAdminAnswers;
            }
            existing.farmer_score_percentage = computedScore;
            const updated = await existing.save();
            await updated.populate([
                'farmId',
                {
                    path: 'assignment_id',
                    populate: { path: 'adminid', select: 'name email district location' }
                }
            ]);

            return res.status(200).json({
                message: "Farm Assignment response updated successfully",
                farmAssignment: updated
            });
        }

        const farmAssignmentToSave = new FarmAssignment({
            farmId,
            assignment_id,
            farmer_answer: formattedFarmerAnswers,
            admin_answer: formattedAdminAnswers,
            farmer_score_percentage: computedScore
        });

        const savedFarmAssignment = await farmAssignmentToSave.save();
        await savedFarmAssignment.populate([
            'farmId',
            {
                path: 'assignment_id',
                populate: { path: 'adminid', select: 'name email district location' }
            }
        ]);

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

// Update existing Farm Assignment by ID
const updateFarmAssignment = async (req, res) => {
    try {
        const { id, farmId, assignment_id } = req.params;
        const { farmer_answer, admin_answer, farmer_score_percentage } = req.body;

        let query = {};
        if (id) {
            query = { _id: id };
        } else if (farmId && assignment_id) {
            query = { farmId, assignment_id };
        } else {
            return res.status(400).json({ message: "Assignment ID or Farm/Assignment params required" });
        }

        const record = await FarmAssignment.findOne(query);
        if (!record) {
            return res.status(404).json({ message: "Farm Assignment not found to update" });
        }

        if (farmer_answer !== undefined) {
            record.farmer_answer = formatAnswers(farmer_answer);
        }

        if (admin_answer !== undefined) {
            record.admin_answer = formatAnswers(admin_answer);
        } else if (!record.admin_answer || record.admin_answer.length === 0) {
            const benchmark = await BiosecurityAssessment.findById(record.assignment_id);
            if (benchmark && Array.isArray(benchmark.question_answer)) {
                record.admin_answer = benchmark.question_answer.map((q) => ({
                    answer: Boolean(q.answer)
                }));
            }
        }

        if (farmer_score_percentage !== undefined) {
            record.farmer_score_percentage = Math.min(100, Math.max(0, Math.round(Number(farmer_score_percentage))));
        } else if (farmer_answer !== undefined) {
            record.farmer_score_percentage = await calculateScorePercentage(
                record.assignment_id,
                record.farmer_answer,
                undefined
            );
        }

        const saved = await record.save();
        await saved.populate([
            'farmId',
            {
                path: 'assignment_id',
                populate: { path: 'adminid', select: 'name email district location' }
            }
        ]);

        res.status(200).json({
            message: "Farm Assignment updated successfully",
            farmAssignment: saved
        });
    } catch (error) {
        res.status(500).json({
            message: "Problem updating Farm Assignment",
            error: error.message
        });
    }
};

// Get All Farm Assignments
const getAllFarmAssignments = async (req, res) => {
    try {
        const list = await FarmAssignment.find()
            .populate('farmId')
            .populate({
                path: 'assignment_id',
                populate: { path: 'adminid', select: 'name email district location' }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "All Farm Assignments fetched successfully",
            count: list.length,
            farmAssignments: list
        });
    } catch (error) {
        res.status(500).json({
            message: "Problem getting all Farm Assignments",
            error: error.message
        });
    }
};

// Get Farm Assignment by ID
const getFarmAssignmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await FarmAssignment.findById(id)
            .populate('farmId')
            .populate({
                path: 'assignment_id',
                populate: { path: 'adminid', select: 'name email district location' }
            });

        if (!record) {
            return res.status(404).json({ message: "Farm Assignment not found" });
        }

        res.status(200).json({
            message: "Farm Assignment fetched successfully",
            farmAssignment: record
        });
    } catch (error) {
        res.status(500).json({
            message: "Problem getting Farm Assignment",
            error: error.message
        });
    }
};

// Get Assignments by Farm ID
const getFarmAssignmentByFarmId = async (req, res) => {
    try {
        const { farmId } = req.params;

        const farmAssignment = await FarmAssignment.find({ farmId })
            .populate('farmId')
            .populate({
                path: 'assignment_id',
                populate: { path: 'adminid', select: 'name email district location' }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Farm Assignments fetched successfully",
            count: farmAssignment.length,
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

        const farmAssignment = await FarmAssignment.find({ assignment_id })
            .populate('farmId')
            .populate({
                path: 'assignment_id',
                populate: { path: 'adminid', select: 'name email district location' }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Farm Assignments fetched successfully",
            count: farmAssignment.length,
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
            deletedCount: farmAssignment.deletedCount
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
            deletedCount: farmAssignment.deletedCount
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
        const { farmId, assignment_id, id } = req.params;

        let query = {};
        if (id) {
            query = { _id: id };
        } else if (farmId && assignment_id) {
            query = { farmId, assignment_id };
        }

        const farmAssignment = await FarmAssignment.findOneAndDelete(query);

        if (!farmAssignment) {
            return res.status(404).json({
                message: "Relation not found to delete"
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
    updateFarmAssignment,
    getAllFarmAssignments,
    getFarmAssignmentById,
    getFarmAssignmentByFarmId,
    getFarmAssignmentByAssignmentId,
    deleteFarmAssignmentByFarmId,
    deleteFarmAssignmentByAssignmentId,
    deleteFarmAssignment
};