const express = require('express');
const router = express.Router();
const { getUser,registerUser, loginUser, logoutUser } = require("../Controllers/user.js");

router.route("/").post( getUser)
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser)

module.exports = router;