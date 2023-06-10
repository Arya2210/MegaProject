const {instance} = require("../config/Razorpay") ;
const User = require("../models/User")
const Course = require("../models/Course") 
const mailSender = require("../utils/mailSender")
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

// capture payment

exports.capturePayment = async(req , res)=>{
    

        // we need courseId and UserId means konsa course konsa user buy kr rha h
        // get courseid and userid
        const {course_id} = req.body
        const userId = req.user.id
        // validation
        // valid courseiD
        if(!course_id){
            return res.status(400).json({
                success : false ,
                message : "PRovide valid course id"
            })
        }
        let course ;
        // valid course details
        try{
            course = await Course.findById(course_id) ;
            if(!course){
                return res.status(400).json({
                    success : false ,
                    message : "Could could not find Course"
                })
            }
            // user already pay for same course means user schema me couseContent me check krenge courseId

            // userId = string form , courseid = objectke form me
            // convert userId to object Id kyuki course me user objectid me stored hh

            const uid = new mongoose.Schema.Types.ObjectId(userId) ;

            if(course.studentsEnrolled.includes(uid)){
                return res.status(400).json({
                    success : false ,
                    message : "Course already purchased or Enrolled"
                })
            }





        }catch(err){
            console.error(err) ;
            return res.status(400).json({
                success : false ,
                message : err.message
            })
        }

// PAYMENT CODE STARTED
        // order create

        const price = course.price ;
        const currency = "INR" ;

        const options = {
            amount : amount *100 ,
            currency ,
            receipt : Math.random(Date.now()).toString() ,
            notes : {
                course_id : course_id ,
                userId ,
            }
        }


        try{

            const paymentResponse = await instance.orders.create(options) ;
            console.log(paymentResponse)

            return res.status(200).json({
                success : true ,
                courseName : course.courseName ,
                courseDescription : course.courseDescription ,
                thumbnail : course.thumbnail ,
                orderId : paymentResponse.id ,
                currency : paymentResponse.currency ,
                amount : paymentResponse.amount ,

            })

        }catch(err){
               console.log(err) ;
               return res.status(400).json({
                success : false ,
                message : "Could not initiate Order"
            })
        }

        // return response

    
    
}

// verify Signature of Razorpay and Server

exports.verifySignature = async ( req , res)=>{
    const webhookSecret = "12345678" ;
    // razorpay signature send karega
    const signature = req.headers["x-razorpay-signature"] ;

    // Hmac ? = hashed map authentication code ;-> HMAC uses hashing algorithm(sha256) and secret key(12345678) 

    const shasum = crypto.createHmac("sha256" , webhookSecret)
// ye jo req aa rhi h vo razorpay se aaygi 
    shasum.update(JSON.stringify(req.body)) ;
    const digest = shasum.digest("hex")

    if(signature === digest){
        console.log("payment is Authorized")

        // Action Authorization ke baad hoga
        // payment authorized ho gaye then koye action lo ex- User schema ke course me courseid add krdo and Course schme ke studentEnrolled me userid daal do 
        const {courseId , userId} = req.body.payload.payment.entity.notes ;
        try{

            // fullfil action
            // find the course and enroll the student and find the user and add coursId to courses
            const enrolledCourse = await Course.findOneAndUpdate( {_id : courseId} ,
                                                             {$push:{studentsEnrolled : userId}} ,
                                                              {new : true} ,
                                                              
            )
            if(!enrolledCourse){
                return res.status(400).json({
                    success : false ,
                    message : "course not found"
                })
            }
            console.log(enrolledCourse)
            const enrolledStudent = await User.findOneAndUpdate(
                                                                 {_id : userId} ,
                                                                 {$push:{courses : courseId}} ,
                                                                 {new : true} ,
            )
            if(!enrolledStudent){
                return res.status(400).json({
                    success : false ,
                    message : "Student Not found"
                })
            }

            console.log(enrolledStudent) ;

            // mail send krdo confirmation wala

            const emailResponse = await mailSender(
                                                enrolledStudent.email ,
                                                "Congo course purchesed" ,
                                                "congo enjoy the course" ,
                                               
            )

            console.log(emailResponse)
            return res.status(200).json({
                success : true,
                message : "mail send sucecsfully"
            })


        }catch(err){

            return res.status(400).json({
                success : false ,
                message : err.message ,
            })

        }
    }
    else{
        return res.status(400).json({
            success : false ,
            message : "Invalid Request"
        })
    }


}