const Course = require("../models/Course")
const User = require("../models/User") 
const Category = require("../models/Category")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
// user ke admin role ke liye course wale section ko update krna hoga

const {uploaderImageToCloudinary} = require("../utils/imageUploader") ;

exports.createCourse = async(req , res)=>{
    try{
     let { courseName , courseDescription , whatYouWillLearn , price , tag , category , status , instructions} = req.body 

    //  get thubnails
    // const thumbnail = req.files.thumbnailImage
    // validation

    if(!courseName || !courseDescription || !whatYouWillLearn || !price
        //  || !tag
         ){
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
    // const thumbnailImage = await uploaderImageToCloudinary(thumbnail , process.env.FOLDER_NAME) 
    // console.log( "thumbnailimage = ",thumbnailImage)

    // create entry for new course

    const newCourse = await Course.create({
        courseName ,
        courseDescription ,
        instructor : instructorDetails._id ,
        whatYouWillLearn ,
        price ,
        category : categoryDetails._id ,
        tag  ,
        
        

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

// Edit Course Details
exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
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

return res.status(200).json({
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
exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  // Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }
  // Delete the Course
  exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }