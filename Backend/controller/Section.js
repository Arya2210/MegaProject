const Section = require("../models/Section")
const Course = require("../models/Course") 

exports.createSection = async (req , res)=>{
    try{
        // data fetch
        const {sectionName  , courseId} = req.body
        // validTION

        if(!sectionName || !courseId){
            return res.status(400).json({
                success : false ,
                message : "all field are requied"
              })

        }

        // create section 

        const newSection =await Section.create({sectionName}) ;
        // update course with section objectId

        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                                       {_id :courseId} ,
                                                       {$push : {courseContent : newSection._id}},
                                                       {new : true} ,
        )
        // HW use populate to show section and sub section

        return res.status(200).json({
            success : true ,
            message : " Sections created" ,
            data : updatedCourseDetails
        })

       }catch(err){
        return res.status(400).json({
            success : false ,
            message : "Scetion not Created" ,
            error : err.message
          })

    }
}

exports.updateSection = async (req , res)=>{
    try{ 
        // data input
        const {sectionName ,sectionId } = req.body 
        // data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success : false ,
                message : "all field are required"
              })
        }
        // update data 
        const  section = await Section.findByIdAndUpdate(
                                                         {_id : sectionId},
                                                         {sectionName} ,
                                                         {new : true} ,
        )

        return res.status(200).json({
            success : true ,
            message : "Scetion Updated Suceesfully"
          })

    }
    catch(err){
        return res.status(400).json({
            success : false ,
            message : "Section Not Updated",
            error : err.message
          })

    }
}
exports.deleteSection = async(req , res)=>{
    try{

        // get id
      const {sectionId} = req.body ;
        // use find by id and delete
        await Section.findByIdAndDelete(sectionId)
        // 
        return res.status(200).json({
            success : true,
            message : "Deleted succesfully"
          })

    }catch(err){
        return res.status(400).json({
            success : false ,
            message : "deletion failed"
          })
    }
}