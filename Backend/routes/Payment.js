const express = require("express")
const router = express.Router() ;

const {capturePayment, verifyPayment} = require("../controller/Payment")
const {isAdmin ,isInstructor, isStudent, auth} = require("../middlewares/auth")

router.post("/capturePayment" , auth , isStudent , capturePayment) ;
router.post("/verifySignature" ,auth , isStudent, verifyPayment) ;

module.exports = router