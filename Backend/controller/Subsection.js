const Section = require("../models/Section");
const SubSection = require("../models/SubSection") 
const { uploaderImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config()

exports.createSubsection = async (req , res)=>{
    try{
        // fetch data , sctionid is required kyuki subsection ko konse section me insert krna hh
        const {sectionId, title , timeDuration , description} = req.body

        // extract file video
        const video = req.files.videoFile ;
        // validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success : false ,
                message : "all field are required"
            })
        }

        console.log(video);
        // upload video to cloud and get secure url
        const uploadDetails = await uploaderImageToCloudinary(video ,process.env.FOLDER_NAME) ;
        console.log("uploadDetails=>" , uploadDetails)
        

        // create subsection
        const subSectionDetails = await SubSection.create({
            title : title ,
            timeDuration : timeDuration ,
            description : description ,
            videoUrl : uploadDetails.secure_url ,
        }) 
        console.log("subSectionDetails=>" , subSectionDetails)
        // update section with subsection obj ID

        const updatedSection = await Section.findByIdAndUpdate({_id : sectionId} ,{$push : {SubSection : subSectionDetails._id} } ,{new : true}).populate("subSection").exec() ;
        console.log("updatedSection=>" , updatedSection)
        return res.status(200).json({
            success : true ,
            message : "SubSection Created",
            data : updatedSection
          })

        
    }
    catch(err){
        return res.status(400).json({
            success : false ,
            erroe : err.message ,
            message : err.message ,
            
          })
    }
    
}

// HW

exports.updateSubSection = async (req, res)=>{
    try{
          
        const {sectionId , title , description} = req.body ;

        const subSection = await SubSection.findById(sectionId)

        if(!subSection){
            return res.status(404).json({
                success : false ,
                message : "Subsection Not found"
            })
        }

        if(title !== undefined){
            subSection.title = title 
        }
        if(description !== undefined){
            subSection.description = description 
        }
        if(req.files && req.files.video !== undefined){
            const video = req.files.video 
            const uploadDetails = await uploaderImageToCloudinary(
                video ,
                process.env.FOLDER_NAME 
            )

            subSection.videoUrl = uploadDetails.secure_url ;
            subSection.timeDuration = `${uploadDetails.duration}`

        }

        await SubSection.save() ;

        return res.json({
            success: true ,
            message : "Subsection Updated Succesfully"
        })
    }
    catch(err){

        return res.json({
            successS: false ,
            message : "Subsection NOT Updated Succesfully" ,
            error : err.message ,
        })

    }
}
exports.deleteSubSection = async(req , res)=>{
    try{

        const {subSectionId , sectionId} = req.body 

        await Section.findByIdAndUpdate( {_id : sectionId} ,
                                         {$pull : {subSection : subSectionId}}

        )

        const subSection = await SubSection.findByIdAndDelete({_id : subSectionId}) ;

        if(!subSection){
            return res.status(400).json({
                success : false ,
                message : "Subsection Not Found"
            })
        }
        return res.status(200).json({
            success : true ,
            message : "Subsection deleted Sucecsfully"
        })

    }catch(err){
        return res.status(500).json({
            success : false ,
            message :err.message
        })
    }
}