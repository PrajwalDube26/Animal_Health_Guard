const express = require('express');
const router = express.Router();

const {
    createFarmAssignment,
    getFarmAssignmentByFarmId,
    getFarmAssignmentByAssignmentId,
    deleteFarmAssignmentByFarmId,
    deleteFarmAssignmentByAssignmentId,
    deleteFarmAssignment
} = require('../controller/farm_assignment');


// Create Farm-Assignment Relation
router.post(
    '/create_farm_assignment/:farmId/:assignment_id',
    createFarmAssignment
);


// Get
router.get(
    '/get_farm_assignment_by_farmId/:farmId',
    getFarmAssignmentByFarmId
);

router.get(
    '/get_farm_assignment_by_assignmentId/:assignment_id',
    getFarmAssignmentByAssignmentId
);


// Delete
router.delete(
    '/delete_farm_assignment_by_farmId/:farmId',
    deleteFarmAssignmentByFarmId
);

router.delete(
    '/delete_farm_assignment_by_assignmentId/:assignment_id',
    deleteFarmAssignmentByAssignmentId
);

router.delete(
    '/delete_farm_assignment/:farmId/:assignment_id',
    deleteFarmAssignment
);

module.exports = router;