const Router = require("express");

const { getUser,registerUser, loginUser, logoutUser, changeCurrentPassword, updateAccountDetails } = require("../Controllers/user.js");

const verifyJWT = require("../middlewares/auth.js");
const router = Router();

router.route("/").post(getUser)
router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)

// router.route("/tokenRefresh").post(refreshAccessToken)

// router.route("/changepassword").post(verifyJWT, changeCurrentPassword)

// router.route("/current_user").get(verifyJWT, getCurrentUser)

// router.route("/update_account").patch(verifyJWT, updateAccountDetails)


module.exports = router;