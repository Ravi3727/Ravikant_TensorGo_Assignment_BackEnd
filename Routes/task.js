// import express from 'express';
const express = require('express');
const router = express.Router();

const {createTask} = require("../Controllers/task");

router.post("/createtask",createTask);
module.exports = router;