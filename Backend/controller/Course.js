const Course = require("../models/Course")
const User = require("../models/User") 
const Category = require("../models/Category")
// user ke admin role ke liye course wale section ko update krna hoga

const {uploaderImageToCloudinary} = require("../utils/imageUploader") ;

exports.createCourse = async(req , res)=>{
    try{
     let { courseName , courseDescription , whatYouWillLearn , price , tag , category , status , instructions} = req.body 

    //  get thubnails
    const thumbnail = req.files.thumbnailImage
    // validation

    if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag){
        return res.status(400).json({
            success : false ,
            messgae : "all field are required"
        })
    }
    if(!status || status === undefined){
        status = "Draft" 
    }

    // check for instructor :- course me instructor ki id bhi save krni pafhti hh isliye instructor ki id required hh
    // ek baar login ho gya to fir har request me token ka payload rahega jisse user id milegi

    const userId = req.user.id  ;

    const instructorDetails = await User.findById(userId , {accountType : "Instructor"}) ;
    console.log("instructor detqail" , instructorDetails) ;

    if(!instructorDetails){
        return res.status(400).json({
            success : false ,
            messgae : "instructor not found"
        })
    }

    // check givrn tag is valid or not

    const categoryDetails = await Category.findById(category)

    if(!categoryDetails){
        return res.status(400).json({
            success : false ,
            message : "category details not found",
            data : categoryDetails
        })
    }

    // upload courese image to cloudsdinary
    const thumbnailImage = await uploaderImageToCloudinary(thumbnail , process.env.FOLDER_NAME) 
    console.log( "thumbnailimage = ",thumbnailImage)

    // create entry for new course

    const newCourse = await Course.create({
        courseName ,
        courseDescription ,
        instructor : instructorDetails._id ,
        whatYouWillLearn ,
        price ,
        category : categoryDetails._id ,
        tag  ,
        thumbnail : thumbnailImage.secure_url ,
        

    })
    console.log("newCourse=>" , newCourse)

    // update user(instructor) schema : add the new course to instructer user

        const user = await User.findByIdAndUpdate(
                                {_id : instructorDetails._id} ,
                                { $push :
                                     {courses : newCourse._id }
                                },
                             {new : true}) ;

       console.log("user=>" , user) ;                      


    const cate =     await Category.findByIdAndUpdate(
                             {_id : category },
                             {$push :{
                                 course : newCourse._id
                             }} ,
                             {new : true}
        )       
        
        console.log("cate=>" , cate)

      return res.status(200).json({
          success : true ,
         messgae : "course created succesfully" ,
         data : newCourse
                            })               

    

      

    }
    catch(err){
        return res.status(400).json({
            success : false ,
            messgae : "Course does not created", 
            error : err.message
        })
    }
}


exports.getAllCourses = async(req , res)=>{
    try{

        const allCourses = await Course.find({} , {
                                                courseName : true ,
                                                price : true ,
                                                thumbnail : true ,
                                                instructor : true ,
                                                ratingAndReviews : true ,
                                                studentsEnrolled : true ,
                                                }).populate("instructor").exec() ;

                                                return res.status(200).json({
                                                    success : true ,
                                                    messgae : "All course is fetched" ,
                                                    data : allCourses ,
                                                })                                            

    }catch(err){
        return res.status(400).json({
            success : false ,
            messgae : "cannaot fetch course data"
        })
    }
}

exports.getCourseDetails = async(req , res)=>{
    try{

        const {courseId} = req.body ;
        // find course details

        const courseDetails = await Course.findById({_id : courseId})
                                                                              .populate(
                                                                               {
                                                                                   path : "instructor" ,
                                                                                   populate :{
                                                                                       path : "additionalDetails" ,
                                                                                   },
                                                                               }
                                                                    ).populate("category")
                                                                    //  .populate("ratingAndreviews")
                                                                    .populate({
                                                                       path : "courseContent" ,
                                                                        populate:{
                                                                            path:"subSection"
                                                                        },
                                                                    }).exec() ;
                                                                             
// validation

if(!courseDetails){
    return res.status(400).json({
        success : true ,
        message : "could not find course with course id"
    })
}
// return response

return res.status(400).json({
    success : true ,
    message :"course details fetched succesfully" ,
    course : courseDetails ,
})



    }catch(err){
        return res.status(400).json({
            success : false ,
            message :err.message ,
        })
    }
    
}