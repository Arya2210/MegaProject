const {instance} = require("../config/Razorpay") ;
const User = require("../models/User")
const Course = require("../models/Course") 
const mailSender = require("../utils/mailSender")
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail");
const { default: mongoose } = require("mongoose");


exports.capturePayment = async(req ,res)=>{
    

        const {courses} = req.body ;
        const userId = req.user.Id ;

        if(courses.length === 0){
            return res.json({
                success : false ,
                message : "please provide the courses"
            })
        }

        let totalAmount =  0 ;

        for(const course_id of courses){
            let course ;

            try{
               
                course = await Course.findById(course_id) ;
                if(!course){
                   return res.status(200).json({
                       success : false ,
                       message : "could not find the course"
                   })
                }

                const uid = new mongoose.Types.ObjectId(course_id) ;
                if(course.studentsEnrolled.includes(uid)){
                    return res.status(200).json({
                        success : false ,
                        message :"student already enrolled "
                    })
                }

                totalAmount += course.price ;

            }catch(err){
               return res.status(400).json({
                   success : false ,
                   message : err.message ,
               })
            }
        }

        const options = {
            amount : totalAmount*100 ,
            currency : "INR" ,
            receipt : Math.random(Date.now().toString()) ,
        }

        try{

            const paymentResponse = await instance.orders.create(options) ;
            res.json({
                success : true ,
                message : paymentResponse ,
            })

        }catch(err){
            console.log(err.message) 
            return res.json({
                success : false ,
                message : "could not do payment"
            })

        }

    
}

exports.verifyPayment = async(res ,req)=>{
    const razorpay_order_id = req.body?.razorpay_order_id ;
    const razorpay_payment_id = req.body?.razorpay_payment_id ;
    const razorpay_signature = req.body?.razorpay_signature ;
    const courses = req.body?.courses ;
    const userId =req.user.id ;

    if(!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !courses || !userId){
        return res.status(200).json({
            success : false ,
            message : "payment failed"
        })
    }


    let body = razorpay_order_id + "|" + razorpay_payment_id ;
    const expectedSignature = crypto.createHmac("sha256" . process.env.RAZORPAY_SECRET)
                                    .update(body.toString())
                                    .digest("hex") ;


             if(expectedSignature === razorpay_signature){
                //    enroll krwaro student ko

                await enrollStudent(courses , userId  ,res) ;

                return res.status.json({
                    success : true ,
                    message : "payment is successful"
                })
             }
             
             return res.status(200).json({
                 success : false, 
                 message : "Payment failed"
             })
}

const enrollStudent = async(courses ,userId ,res)=>{

    if(!courses || !userId){
        return res.status(400).json({
            success : false ,
            message : "Id not found provide data" ,
        })
    }

    for(const courseId of courses){
     try{
        const enrolledCourse = await Course.findOneAndUpdate(
            {_id : courseId },
            {$push:{studentEnrolled : userId}},
            {new : true}

        )

        if(!enrolledCourse){
            return res.status(500).json({
                success :false ,
                message :" course not found" ,
            })
        }

        // student ke acoount me course id push kr do

        const enrolledStudent = await User.findByIdAndUpdate(userId , {$push:{courses : courseId}}, {new:true}) 

        // send mail
        const emailResponse =  await mailSender(
            enrollStudent.email ,
            `Successful enrolled into ${enrolledCourse.courseName}` ,
            courseEnrollmentEmail(enrolledCourse.courseName , `${enrolledStudent.firstName}`)
        )

        console.log("Email Sent Succesfully" , emailResponse) ;
       }
       catch(err){
           return res.status(404).json({
               success : false ,
               message : err.message ,
           })
       }
    }
 
}

exports.sendPaymentSuccessEmail =async(req , res)=>{
    const {orderId ,paymentId , amount} = req.body ;

    const userId = req.user.id ;

    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({
            success : false ,
            messsage : "provide all the field"
        })
    }

    try{

        const enrolledStudent = await User.findById(userId) ;
        await mailSender(
              enrolledStudent.email ,
              "PAYMENT RECEIVED" ,
              paymentSuccessEmail(`${enrolledStudent.firstName}`) ,
              amount/100 , orderId ,paymentId
        )

    }catch(err){

        return res.status(400).json({
            success : false ,
            message : err.message ,
        })

    }
}

































// capture payment

// exports.capturePayment = async(req , res)=>{
    

//         // we need courseId and UserId means konsa course konsa user buy kr rha h
//         // get courseid and userid
//         const {course_id} = req.body
//         const userId = req.user.id
//         // validation
//         // valid courseiD
//         if(!course_id){
//             return res.status(400).json({
//                 success : false ,
//                 message : "PRovide valid course id"
//             })
//         }
//         let course ;
//         // valid course details
//         try{
//             course = await Course.findById(course_id) ;
//             if(!course){
//                 return res.status(400).json({
//                     success : false ,
//                     message : "Could could not find Course"
//                 })
//             }
//             // user already pay for same course means user schema me couseContent me check krenge courseId

//             // userId = string form , courseid = objectke form me
//             // convert userId to object Id kyuki course me user objectid me stored hh

//             const uid = new mongoose.Schema.Types.ObjectId(userId) ;

//             if(course.studentsEnrolled.includes(uid)){
//                 return res.status(400).json({
//                     success : false ,
//                     message : "Course already purchased or Enrolled"
//                 })
//             }





//         }catch(err){
//             console.error(err) ;
//             return res.status(400).json({
//                 success : false ,
//                 message : err.message
//             })
//         }

// // PAYMENT CODE STARTED
//         // order create

//         const price = course.price ;
//         const currency = "INR" ;

//         const options = {
//             amount : amount *100 ,
//             currency ,
//             receipt : Math.random(Date.now()).toString() ,
//             notes : {
//                 course_id : course_id ,
//                 userId ,
//             }
//         }


//         try{

//             const paymentResponse = await instance.orders.create(options) ;
//             console.log(paymentResponse)

//             return res.status(200).json({
//                 success : true ,
//                 courseName : course.courseName ,
//                 courseDescription : course.courseDescription ,
//                 thumbnail : course.thumbnail ,
//                 orderId : paymentResponse.id ,
//                 currency : paymentResponse.currency ,
//                 amount : paymentResponse.amount ,

//             })

//         }catch(err){
//                console.log(err) ;
//                return res.status(400).json({
//                 success : false ,
//                 message : "Could not initiate Order"
//             })
//         }

//         // return response

    
    
// }

// // verify Signature of Razorpay and Server

// exports.verifySignature = async ( req , res)=>{
//     const webhookSecret = "12345678" ;
//     // razorpay signature send karega
//     const signature = req.headers["x-razorpay-signature"] ;

//     // Hmac ? = hashed map authentication code ;-> HMAC uses hashing algorithm(sha256) and secret key(12345678) 

//     const shasum = crypto.createHmac("sha256" , webhookSecret)
// // ye jo req aa rhi h vo razorpay se aaygi 
//     shasum.update(JSON.stringify(req.body)) ;
//     const digest = shasum.digest("hex")

//     if(signature === digest){
//         console.log("payment is Authorized")

//         // Action Authorization ke baad hoga
//         // payment authorized ho gaye then koye action lo ex- User schema ke course me courseid add krdo and Course schme ke studentEnrolled me userid daal do 
//         const {courseId , userId} = req.body.payload.payment.entity.notes ;
//         try{

//             // fullfil action
//             // find the course and enroll the student and find the user and add coursId to courses
//             const enrolledCourse = await Course.findOneAndUpdate( {_id : courseId} ,
//                                                              {$push:{studentsEnrolled : userId}} ,
//                                                               {new : true} ,
                                                              
//             )
//             if(!enrolledCourse){
//                 return res.status(400).json({
//                     success : false ,
//                     message : "course not found"
//                 })
//             }
//             console.log(enrolledCourse)
//             const enrolledStudent = await User.findOneAndUpdate(
//                                                                  {_id : userId} ,
//                                                                  {$push:{courses : courseId}} ,
//                                                                  {new : true} ,
//             )
//             if(!enrolledStudent){
//                 return res.status(400).json({
//                     success : false ,
//                     message : "Student Not found"
//                 })
//             }

//             console.log(enrolledStudent) ;

//             // mail send krdo confirmation wala

//             const emailResponse = await mailSender(
//                                                 enrolledStudent.email ,
//                                                 "Congo course purchesed" ,
//                                                 "congo enjoy the course" ,
                                               
//             )

//             console.log(emailResponse)
//             return res.status(200).json({
//                 success : true,
//                 message : "mail send sucecsfully"
//             })


//         }catch(err){

//             return res.status(400).json({
//                 success : false ,
//                 message : err.message ,
//             })

//         }
//     }
//     else{
//         return res.status(400).json({
//             success : false ,
//             message : "Invalid Request"
//         })
//     }


// }