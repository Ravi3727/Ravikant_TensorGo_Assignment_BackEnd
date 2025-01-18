const express = require('express');
const router = express.Router();

const {createPlan, deletePlan,updatePlan,getPlans } = require("../Controllers/plan");


router.post("/plan", createPlan);
router.get("/plan", getPlans);

router.delete("/plan/:id", deletePlan);

router.patch("/plan/:id", updatePlan);

module.exports = router;