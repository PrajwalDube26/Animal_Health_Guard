const Biosecurity_Assessment_Models = require('../models/Biosecurity_assessment');

const VALID_FARM_TYPES = ['dairy', 'poultry', 'pig', 'goat', 'sheep'];

// Submit / Create Assessment (Admin)
const submit_assessment = async (req, res) => {
    try {
        const adminid = req.admin.id;
        const { riskScore, riskLevel, question_answer, farmType } = req.body;

        if (!farmType || !VALID_FARM_TYPES.includes(farmType.toLowerCase())) {
            return res.status(400).json({
                message: `Valid farmType is required. Allowed values: ${VALID_FARM_TYPES.join(', ')}`
            });
        }

        let computedRiskScore = riskScore !== undefined ? Number(riskScore) : 0;
        let computedRiskLevel = riskLevel ? String(riskLevel).toLowerCase() : 'low';

        const qaList = Array.isArray(question_answer)
            ? question_answer
                .filter(q => q && typeof q.question === 'string' && q.question.trim() !== '')
                .map(q => ({
                    question: q.question.trim(),
                    answer: Boolean(q.answer)
                }))
            : [];

        if (computedRiskScore === undefined && qaList.length > 0) {
            const failed = qaList.filter(q => q.answer === false).length;
            computedRiskScore = Math.round((failed / qaList.length) * 100);
        } else if (computedRiskScore === undefined) {
            computedRiskScore = 0;
        }

        if (!computedRiskLevel) {
            computedRiskLevel = computedRiskScore >= 70 ? 'high' : computedRiskScore >= 35 ? 'medium' : 'low';
        }

        const assignment_to_save = new Biosecurity_Assessment_Models({
            adminid,
            farmType: farmType.toLowerCase(),
            riskScore: computedRiskScore,
            riskLevel: computedRiskLevel.toLowerCase(),
            question_answer: qaList
        });

        const saved_assignment = await assignment_to_save.save();
        await saved_assignment.populate('adminid', 'name email district location');

        res.status(201).json({
            message: "assignment added succesfully",
            assignment: saved_assignment,
            assessment: saved_assignment
        });

    } catch (error) {
        res.status(500).json({
            message: "problem in assignment adding",
            error: error.message
        });
    }
};

// Get assessments of logged-in Admin (with optional farmType filter)
const get_assignment_of_admin = async (req, res) => {
    try {
        const adminid = req.admin.id;
        const { farmType } = req.query;

        const filter = { adminid };
        if (farmType && VALID_FARM_TYPES.includes(farmType.toLowerCase())) {
            filter.farmType = farmType.toLowerCase();
        }

        const assignment_of_adminid = await Biosecurity_Assessment_Models.find(filter)
            .populate('adminid', 'name email district location')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "assignment find succesfully",
            count: assignment_of_adminid.length,
            assignments: assignment_of_adminid,
            assessments: assignment_of_adminid
        });

    } catch (error) {
        res.status(500).json({
            message: "problem in assignment finding",
            error: error.message
        });
    }
};

// Get All Assessments (Global / Farmers, with optional farmType filter)
const get_all_assessments = async (req, res) => {
    try {
        const { farmType } = req.query;

        const filter = {};
        if (farmType && VALID_FARM_TYPES.includes(farmType.toLowerCase())) {
            filter.farmType = farmType.toLowerCase();
        }

        const assessments = await Biosecurity_Assessment_Models.find(filter)
            .populate('adminid', 'name email district location')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "All biosecurity assessments fetched successfully",
            count: assessments.length,
            assignments: assessments,
            assessments: assessments
        });

    } catch (error) {
        res.status(500).json({
            message: "problem in fetching all assessments",
            error: error.message
        });
    }
};

// Get Assessments by farmType
const get_assessments_by_farmtype = async (req, res) => {
    try {
        const { farmType } = req.params;

        if (!VALID_FARM_TYPES.includes(farmType.toLowerCase())) {
            return res.status(400).json({
                message: `Invalid farmType. Allowed values: ${VALID_FARM_TYPES.join(', ')}`
            });
        }

        const assessments = await Biosecurity_Assessment_Models.find({
            farmType: farmType.toLowerCase()
        })
            .populate('adminid', 'name email district location')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: `Biosecurity assessments for ${farmType} fetched successfully`,
            count: assessments.length,
            assignments: assessments,
            assessments: assessments
        });
    } catch (error) {
        res.status(500).json({
            message: "problem in fetching assessments by farmType",
            error: error.message
        });
    }
};

// Get Assessment by ID
const assignment_by_id = async (req, res) => {
    try {
        const { id } = req.params;

        const assignment_byId = await Biosecurity_Assessment_Models.findById(id)
            .populate('adminid', 'name email district location');

        if (!assignment_byId) {
            return res.status(404).json({
                message: "not found an assignment"
            });
        }

        res.status(200).json({
            message: "assignment find succesfully",
            assignment: assignment_byId,
            assessment: assignment_byId
        });

    } catch (error) {
        res.status(500).json({
            message: "problem in assignment finding",
            error: error.message
        });
    }
};

// Delete Assessment (Admin)
const delete_assignment = async (req, res) => {
    try {
        const { id } = req.params;
        const adminid = req.admin.id;

        const deleted_assig = await Biosecurity_Assessment_Models.findOneAndDelete({
            adminid,
            _id: id
        });

        if (!deleted_assig) {
            return res.status(404).json({
                message: "not found to delete"
            });
        }

        res.status(200).json({
            message: "deleting succesfully",
            assignment: deleted_assig,
            assessment: deleted_assig
        });

    } catch (error) {
        res.status(500).json({
            message: "some problem occure in deleting",
            error: error.message
        });
    }
};

// Update Assessment (Admin)
const update_assignment = async (req, res) => {
    try {
        const { id } = req.params;
        const adminid = req.admin.id;
        const { riskScore, riskLevel, question_answer, farmType } = req.body;

        const updateData = {};

        if (farmType !== undefined) {
            if (!VALID_FARM_TYPES.includes(farmType.toLowerCase())) {
                return res.status(400).json({
                    message: `Invalid farmType. Allowed values: ${VALID_FARM_TYPES.join(', ')}`
                });
            }
            updateData.farmType = farmType.toLowerCase();
        }

        if (riskScore !== undefined) updateData.riskScore = Number(riskScore);
        if (riskLevel !== undefined) updateData.riskLevel = String(riskLevel).toLowerCase();

        if (question_answer !== undefined) {
            const cleanedQA = Array.isArray(question_answer)
                ? question_answer
                    .filter(q => q && typeof q.question === 'string' && q.question.trim() !== '')
                    .map(q => ({
                        question: q.question.trim(),
                        answer: Boolean(q.answer)
                    }))
                : [];

            updateData.question_answer = cleanedQA;

            if (riskScore === undefined && cleanedQA.length > 0) {
                const failed = cleanedQA.filter(q => q.answer === false).length;
                updateData.riskScore = Math.round((failed / cleanedQA.length) * 100);
                if (riskLevel === undefined) {
                    updateData.riskLevel = updateData.riskScore >= 70 ? 'high' : updateData.riskScore >= 35 ? 'medium' : 'low';
                }
            } else if (riskScore === undefined && cleanedQA.length === 0) {
                updateData.riskScore = 0;
                if (riskLevel === undefined) updateData.riskLevel = 'low';
            }
        }

        const updated_assignment = await Biosecurity_Assessment_Models.findOneAndUpdate(
            {
                adminid,
                _id: id
            },
            {
                $set: updateData
            },
            {
                new: true,
                runValidators: true
            }
        ).populate('adminid', 'name email district location');

        if (!updated_assignment) {
            return res.status(404).json({
                message: "not found to update"
            });
        }

        res.status(200).json({
            message: "updating succesfully",
            assignment: updated_assignment,
            assessment: updated_assignment
        });

    } catch (error) {
        res.status(500).json({
            message: "some problem occure in updating",
            error: error.message
        });
    }
};

// Add Question to existing Assessment
const add_question_to_assessment = async (req, res) => {
    try {
        const { id } = req.params;
        const adminid = req.admin.id;
        const { question, answer } = req.body;

        if (!question || answer === undefined) {
            return res.status(400).json({ message: "question and answer are required" });
        }

        const assessment = await Biosecurity_Assessment_Models.findOne({ _id: id, adminid });
        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found or unauthorized" });
        }

        assessment.question_answer.push({ question: question.trim(), answer: Boolean(answer) });

        // Recalculate risk score and risk level
        const total = assessment.question_answer.length;
        const failed = assessment.question_answer.filter(q => q.answer === false).length;
        assessment.riskScore = Math.round((failed / total) * 100);
        assessment.riskLevel = assessment.riskScore >= 70 ? 'high' : assessment.riskScore >= 35 ? 'medium' : 'low';

        const saved = await assessment.save();

        res.status(200).json({
            message: "Question added successfully",
            assignment: saved,
            assessment: saved
        });
    } catch (error) {
        res.status(500).json({
            message: "Problem adding question to assessment",
            error: error.message
        });
    }
};

// Delete Question from existing Assessment
const delete_question_from_assessment = async (req, res) => {
    try {
        const { id, questionId } = req.params;
        const adminid = req.admin.id;

        const assessment = await Biosecurity_Assessment_Models.findOne({ _id: id, adminid });
        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found or unauthorized" });
        }

        assessment.question_answer = assessment.question_answer.filter(
            (q) => q._id.toString() !== questionId
        );

        // Recalculate risk score and risk level
        const total = assessment.question_answer.length;
        if (total > 0) {
            const failed = assessment.question_answer.filter(q => q.answer === false).length;
            assessment.riskScore = Math.round((failed / total) * 100);
            assessment.riskLevel = assessment.riskScore >= 70 ? 'high' : assessment.riskScore >= 35 ? 'medium' : 'low';
        } else {
            assessment.riskScore = 0;
            assessment.riskLevel = 'low';
        }

        const saved = await assessment.save();

        res.status(200).json({
            message: "Question deleted successfully",
            assignment: saved,
            assessment: saved
        });
    } catch (error) {
        res.status(500).json({
            message: "Problem deleting question from assessment",
            error: error.message
        });
    }
};

module.exports = {
    submit_assessment,
    get_assignment_of_admin,
    get_all_assessments,
    get_assessments_by_farmtype,
    assignment_by_id,
    delete_assignment,
    update_assignment,
    add_question_to_assessment,
    delete_question_from_assessment
};