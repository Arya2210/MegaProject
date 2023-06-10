const { default: mongoose } = require("mongoose");
const Course = require("../models/Course") ;
const RatingAndReview = require("../models/RatingAndReview");

exports.createRating  = async (req, res)=>{

    try{
        // get userid
        const userId = req.user.id ;
        // fetch data 
        const {rating , review , courseId} =req.body ;
        // check if user is enrolled or not
        const courseDetails =await Course.findOne(
                                                 {
                                                     _id : courseId ,
                                                     studentsEnrolled : {$elemMatch : {$eq:userId}}
                                                 })
        
        if(!courseDetails){
            return res.status(400).json({
                success : false ,
                message :"STudent is not Enrolled in course"
            })
        }                                         
        // or we can use this code insteads of above 
        // if(courseDetails.studentsEnrolled.includes(userId)){
        //     console.log("student is already enrolled")
        // }             
        
        
        // check if user has already given the rating

        const alreadyReview = await RatingAndReview.findOne({
                                                             user : userId ,
                                                             course : courseId ,
        })

        if(alreadyReview){
            return res.status(400).json({
                success : false ,
                message :"Allready reviewed"
            })
        }
        // create rating
        const ratingReview = await RatingAndReview.create({
                                                       user : userId ,
                                                       rating ,
                                                       review ,
                                                       course : courseId ,
        })
        // upadte course with rating

       const updatedCourseDetails =  await Course.findByIdAndUpdate({_id : courseId} , {$push:{ratingAndReviews : ratingReview._id}} , {new : true}) ;

        return res.status(200).json({
            success : true ,
            message :"Rating and review created succesfully" ,
            course : updatedCourseDetails ,
        })


    }catch(err){
            console.log(err) ;
            return res.status(400).json({
                success : false ,
                message :"Rating not Created" ,
                error : err.message
            })
    }

}

exports.getAverageRating = async ( req, res)=>{
    try{

        const {courseId} = req.body ;
        // calc avg rating
    //    bhot sare user leke aao jisne same course liya ho means course id same rahegi
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course : new mongoose.Types.ObjectId(courseId)
                } ,
            },
            {
                $group:{
                    _id : null ,
                    averageRating : {$avg : "$rating"} ,
                }
            }
        ])

        if(result.length >0){
            return res.status(400).json({
                success : true ,
                averagerating : result[0].averageRating ,
            })
        }

        return res.status(200).json({
            success : true ,
            message :"Rating mil gaye"
        })

    }catch(err){
        return res.status(400).json({
            success : false ,
            message :"RAting not found"
        })

    }
}
// ssare course ki saari rating
exports.getAllRating = async (req , res)=>{
    try{
        const allreviews = await RatingAndReview.find({}).sort({rating : "desc"})
                                                         .populate({
                                                             path :"user" ,
                                                             select : "firstName lastName , email , image"
                                                         })
                                                         .populate({
                                                             path : "course" ,
                                                             select : "courseName"
                                                         }).exec() ;
        return res.status(200).json({
        success : true,
        message :"ALL review fetched" ,
        data : allreviews ,
    })                                                  
    }catch(err){

        return res.status(400).json({
            success : false ,
            message :err.message ,
        })

    }
}