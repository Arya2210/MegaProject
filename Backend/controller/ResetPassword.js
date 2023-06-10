const User = require("../models/User") ;
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

// resetPassword token-: for sending mail

exports.resetPasswordToken = async(req , res)=>{

    try{
    // get email from req body
    const {email}=  req.body ;
    // check user for this email
    const user = await User.findOne({email}) ;
    if(!user){
        return res.status(403).json({
            success : false ,
            messgae : "Your Email is not Registerd"
        })
    }
    // generate token :- used for expiration time of token

    const token = crypto.randomUUID() ;

    // update the user by adding token and expiry time
    const updatedDetails = await User.findOneAndUpdate({email : email} , 
                                                     {
                                                         token : token ,
                                                         resetPasswordExpires : Date.now() + 5*60*1000 ,
                                                    },
                                                    {new : true}) ;
    // create Url :- Url se update krne ka path khulega
    const url = `http://localhost:30000/update-password/${token}`
    // send mail containing the Url

    await mailSender(email , "Password reset link" ,`Password reset link : ${url}`)
    console.log("mailurl" , url)

    return res.status(200).json({
        success : true ,
        messgae : "reset password token generated succesfully"
    })


   }catch(err){
    return res.status(400).json({
        success : false ,
        messgae : "reset password token not generated" ,
        error : err.message
    })
  }

}

 
// resetPassword

exports.resetPassword = async (req , res)=>{

    try{
    // data fetch ;- token frontend se aaya hh , frontend ko token link se mila hh
    const {password ,confirmPassword  , token} = req.body
    // validation
    if(password !== confirmPassword ){
        return res.status(400).json({
            success : false ,
            messgae : "password not matching"
        })

    }

    // get user details usiing token

    const userDetails = await User.findOne({token : token}) ;
    // if no enty :-> invalid token
    if(!userDetails){
        return res.status(400).json({
            success : false ,
            messgae : "token is Invalid"
        })
    }

    // token time check
    if(userDetails.resetPasswordExpires < Date.now()){
        return res.status(400).json({
            success : false ,
            messgae : "Time expired"
        })
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password , 10) ;
    // update password ,on teh basis of  token
    await User.findOneAndUpdate(
        {token : token} ,
        {password : hashedPassword} ,
        {new : true} ,
    )
    return res.status(200).json({
        success : true ,
        messgae : "Password updated succesfully"
    })

}
    catch(err){
                
    return res.status(400).json({
        success : false ,
        messgae : "Password not updated"
    })
   }
}