const express = require("express")
const router = express.Router() ;

const {verifySignature ,capturePayment} = require("../controller/Payment")
const {isAdmin ,isInstructor, isStudent, auth} = require("../middlewares/auth")

router.post("/capturePayment" , auth , isStudent , capturePayment) ;
router.post("/verifySignature" , verifySignature) ;

module.exports = router