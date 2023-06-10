const Profile = require("../models/Profile")
const User = require("../models/User");
const Course = require("../models/Course")
const { uploaderImageToCloudinary} = require("../utils/imageUploader")

// jab sign up karenge to pehle se hi profile create eho jaygi

exports.updateProfile = async (req, res) => {
    try {
// fetch data
        const {  dateOfBirth="", about="" ,contactNumber } = req.body 
        // get user id from token payload 
      
        const id = req.user.id ;

        // validation

        // if(!gender  || !contactNumber || !id){
        //     return res.status(400).json({
        //         success : false ,
        //         message : "all field are required"
        //       })
        // }

        // find profile
        const userDetails= await User.findById(id) ;
        const profileId = userDetails.additionalDetails ;

        //2nd way to  update profile details
        const profileDetails = await Profile.findById(profileId)


       
        profileDetails.about = about ;
        profileDetails.contactNumber = contactNumber
        profileDetails.dateOfBirth = dateOfBirth

        await profileDetails.save() ;








        return res.status(400).json({
            success : true ,
            message : "PRofile updated succefully" ,
            
          })


    } catch (err) {
        return res.status(400).json({
            success : false ,
            message : "Profile Not Updated",
            error : err.message
          })
    }
}

exports.deleteAccount = async (req , res)=>{
    try{

        // get id
        const id  = req.user.id ;
        // validation
        const userDetails = await User.findById({_id :id}) ;
        
        if(!userDetails){
            return res.status(400).json({
                success : false ,
                message : "User not found"
            })
        }
        
        // const profileId = userDetails.additionalDetails ;
        
        console.log("id->" ,toString(userDetails._id) )


        const pro =  await Profile.findByIdAndDelete({_id : userDetails._id}) ;
       

        // ToDO : unenroll all user from all course : student enrooled me se user ko hta dena hh

        const courseDetails = await  Course.findById(id) ;

        // await Course.findByIdAndDelete({_id : courseDetails._id })

        // delete profile

        // delete User
        await User.findByIdAndDelete({_id : id}) ;
        return res.status(400).json({
            success : true ,
            message : "Account Deleted"
          })



    }catch(err){
        return res.status(400).json({
            success : false ,
            message : "Account Not deleted" ,
            error : err.message
          })
    }
}

exports.getAllUserDetails = async (req , res)=>{
    try{

        // get id
        const id  = req.user.id 

        const userDetails = await User.findById(id).populate("additionalDetails").exec() ;

        return res.status(200).json({
            success : true ,
            message : "User details is fetched" ,
            data : userDetails ,
          })

    }catch(err){
        return res.status(400).json({
            success : false ,
            message : "User details not found"
          })

    }
}
//  ek user konse courses me enrolled h
exports.getEnrolledCourses = async(req, res)=>{
    try{

        const userId = req.user.id ;
        const userDetails = await User.findOne({
            _id : userId
        }).populate("courses").exec() 

        if(!userDetails){
            return res.status(400).json({
                success : false ,
                message : `Could not find user id : ${userDetails}`
            })
        }

        return res.status(200).json({
            success : true ,
            data : userDetails.courses
        })

    }catch(err){
        return res.status(400).json({
            success : false ,
            message :err.message ,
        })
    }
}

exports.updateDisplayPicture = async(req , res)=>{
    try{

        const displayPicture = req.files.displayPicture 
        const userId = req.user.id 

        const image = await uploaderImageToCloudinary(
            displayPicture ,
            process.env.FOLDER_NAME ,
            1000 ,
            1000
        )

        console.log(image)

        const updatedProfile = await User.findByIdAndUpdate(
                                                            {_id : userId} ,
                                                            {image : image.secure_url} ,
                                                            {new : true}
        )

        res.send({
            success : true ,
            message : "image uploaded" ,
            data : updatedProfile
        })

    }catch(err){
        return res.status(400).json({
            success : false ,
            message :err.message ,
        })
    }
}