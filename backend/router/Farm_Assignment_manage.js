const express = require('express');
const router = express.Router();

const {
    createFarmAssignment,
    updateFarmAssignment,
    getAllFarmAssignments,
    getFarmAssignmentById,
    getFarmAssignmentByFarmId,
    getFarmAssignmentByAssignmentId,
    deleteFarmAssignmentByFarmId,
    deleteFarmAssignmentByAssignmentId,
    deleteFarmAssignment
} = require('../controller/farm_assignment');

// Create / Submit Farm Assignment
router.post(
    '/create_farm_assignment/:farmId/:assignment_id',
    createFarmAssignment
);
router.post(
    '/create_farm_assignment',
    createFarmAssignment
);
router.post(
    '/submit_farm_assignment',
    createFarmAssignment
);

// Update Farm Assignment Response
router.put(
    '/update_farm_assignment/:id',
    updateFarmAssignment
);
router.put(
    '/update_farm_assignment/:farmId/:assignment_id',
    updateFarmAssignment
);

// Get All
router.get(
    '/get_all_farm_assignments',
    getAllFarmAssignments
);

// Get By ID
router.get(
    '/get_farm_assignment_by_id/:id',
    getFarmAssignmentById
);

// Get by Farm ID
router.get(
    '/get_farm_assignment_by_farmId/:farmId',
    getFarmAssignmentByFarmId
);

// Get by Assignment ID
router.get(
    '/get_farm_assignment_by_assignmentId/:assignment_id',
    getFarmAssignmentByAssignmentId
);

// Delete by Farm ID
router.delete(
    '/delete_farm_assignment_by_farmId/:farmId',
    deleteFarmAssignmentByFarmId
);

// Delete by Assignment ID
router.delete(
    '/delete_farm_assignment_by_assignmentId/:assignment_id',
    deleteFarmAssignmentByAssignmentId
);

// Delete specific relation
router.delete(
    '/delete_farm_assignment/:farmId/:assignment_id',
    deleteFarmAssignment
);
router.delete(
    '/delete_farm_assignment_by_id/:id',
    deleteFarmAssignment
);

module.exports = router;