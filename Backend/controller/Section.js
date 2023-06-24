const Section = require("../models/Section")
const Course = require("../models/Course") 
const SubSection = require("../models/SubSection")
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
      const {sectionId , courseId} = req.body ;
      await Course.findByIdAndUpdate(courseId , {
          $pull:{
              courseContent : sectionId ,
          }
      })
        // use find by id and delete
       const section =  await Section.findByIdAndDelete(sectionId)

       console.log(courseId , sectionId)

       if(!section){
           return res.status(404).json({
               success : false ,
               message : "section not found"
           })
       }
        // delete subsection

        await SubSection.deleteMany({_id:{$in:section.subSection}}) ;

        await Section.findByIdAndDelete(sectionId) ;

        const course =await (await Course.findById(courseId)).populated({
            path:"courseContent" ,
            populate :{
                path :" subSection"
            }
        }).exec() ;
        
        




        return res.status(200).json({
            success : true,
            message : "section Deleted succesfully"
          })

    }catch(err){
        return res.status(400).json({
            success : false ,
            message : "deletion failed"
          })
    }
}