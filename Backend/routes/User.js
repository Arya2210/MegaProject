const express = require("express") 
const router = express.Router()

// Import the required controllers and middleware fu

const { login,signUp,sendOTP,changePassword}  = require("../controller/Auth")



const {resetPasswordToken,resetPassword,} = require("../controller/ResetPassword")

const { auth } = require("../middlewares/auth")

router.post("/login", login)


// Route for user signup
 router.post("/signup", signUp)

// Route for sending OTP to the user's email 
router.post("/sendotp" , sendOTP)

// Route for Changing the password
 router.post("/changepassword", auth, changePassword)

//  reset password

router.post("/reset-password-token" , resetPasswordToken) ;

// reseting password after verification

router.post("/reset-password" , resetPassword)

module.exports = router ;