const express = require('express');
const router = express.Router();

const { createEvent, deleteEvent, updateEvent} = require("../Controllers/task");


router.post("/events", createEvent);

router.delete("/events/:id", deleteEvent);

router.patch("/events/:id", updateEvent);

module.exports = router;
