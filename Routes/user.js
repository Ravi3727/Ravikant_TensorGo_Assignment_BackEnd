const express = require('express');
const router = express.Router();
const { getUser,registerUser, loginUser, logoutUser } = require("../Controllers/user.js");
const verifyJWT = require('../middlewares/auth.js');

router.route("/").post(verifyJWT, getUser)
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)

module.exports = router;