const express = require("express")
const router = express.Router() ;


const {getCourseDetails ,getAllCourses ,createCourse , editCourse , getInstructorCourses ,deleteCourse} = require("../controller/Course") 
const {categoryPageDetails  ,showAllCategories  ,createCategory} = require("../controller/Category")
const {deleteSection ,updateSection ,createSection} = require("../controller/Section")
const {deleteSubSection ,updateSubSection ,createSubSection} = require("../controller/Subsection")
const {getAllRating ,getAverageRating ,createRating} = require("../controller/RatingAndReviews")

// import middleWare

const {auth ,isInstructor , isStudent , isAdmin} = require("../middlewares/auth") ;

// ################  ********  COURSE route 

// course can only be created by instructor
router.post( "/createCourse" , auth , isInstructor , createCourse)
// add section to the course

router.post("/addSection" , auth , isInstructor , createSection) ;

// update a section

router.post( "/updateSection" , auth , isInstructor , updateSection) ;
// delete Section

router.post( "/deleteSection" , auth , isInstructor ,deleteSection) ;

// add subsection

router.post("/addSubSection" , auth , isInstructor ,createSubSection) ;

// update subsection

router.post("/updateSubSection",  auth , isInstructor ,updateSubSection) ;

// delete Subsection

router.post("/deleteSubSection" ,  auth , isInstructor ,deleteSubSection)

// get all registered course

router.get("/getAllCourses" , getAllCourses) 

// get detail for specific course

// galti
router.post("/getCourseDetails" , getCourseDetails)

// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)

// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)

// %%%%%%%%%%%%%%%%%%%%%%%%%% CATEGORY ROUTES

router.post("/createCategory" ,  auth , isAdmin , createCategory) ;

router.get("/showAllCategories" , showAllCategories) ;

router.post("/getcategoryPageDetails" , categoryPageDetails) ;

// %%%%%%%%%%%%%%%%%%%%% RATING AND REVIEW

router.post("/createaRating" , auth , isStudent , createRating) ;

router.get("/getAverageRating" , getAverageRating) ;

router.get("/getReviews" , getAllRating)

module.exports = router


