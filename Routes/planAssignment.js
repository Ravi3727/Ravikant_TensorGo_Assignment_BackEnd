const express = require('express');
const router = express.Router();

const {createAssignment, getAssignments, removeUserFromPlan, getUserPlanByUserId} = require("../Controllers/planAssignment");


router.post("/assign-user-to-plan", createAssignment);

router.get("/get-users-by-plan", getAssignments);

router.post("/remove-user-from-plan", removeUserFromPlan);
router.get("/get-userplan-by-userId/:userId", getUserPlanByUserId);
module.exports = router;