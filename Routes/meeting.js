const express = require('express');
const router = express.Router();

const { createMeeting, deleteMeeting, updateMeeting} = require("../Controllers/task");

router.post("/meetings", createMeeting);

router.delete("/meetings/:id", deleteMeeting);

router.patch("/meetings/:id", updateMeeting);

module.exports = router;