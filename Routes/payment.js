const express = require('express');
const router = express.Router();

const { payment } = require("../Controllers/payment");


router.post("/payment", payment);

module.exports = router;