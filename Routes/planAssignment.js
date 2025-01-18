const express = require('express');
const router = express.Router();

const {createAssignment, getAssignments, removeUserFromPlan} = require("../Controllers/planAssignment");


router.post("/assign-user-to-plan", createAssignment);

router.get("/get-users-by-plan", getAssignments);

router.post("/remove-user-from-plan", removeUserFromPlan);
module.exports = router;