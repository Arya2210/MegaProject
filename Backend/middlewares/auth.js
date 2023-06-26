const jwt = require("jsonwebtoken") ;
require("dotenv").config() ;
const User = require("../models/User") ;

// auth

exports.auth = async(req , res ,next)=>{
    try{
        // extract token
         const token = req.cookies.token || req.body.token|| req.header("Authorization").replace("Bearer " , "") ;

         if(!token){
            return res.status(401).json({
                success : false ,
                message : "token nhi hh"
            })
         }

         try{
// jwt verify Returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will throw the error
            const decode =await jwt.verify(token , process.env.JWT_SECRET) ;
            console.log(decode)
            req.user = decode ;

         }catch(err){
            return res.status(401).json({
                success : false ,
                message : "token not verified or invlid"
            })
        } 
         next()
    }
    catch(err){
        return res.status(401).json({
            success : false ,
            message : "something wrong while validating token"
        })
    }
}

// isStudent

exports.isStudent = async (req ,res , next)=>{
    try{

        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success : false ,
                message : "thsi is protected route for student only"
            })
        }
        next()

    }catch(err){
        return res.status(401).json({
            success : false ,
            message : "user role cannot be verified"
        })
    }
}
exports.isInstructor = async (req ,res , next)=>{
    try{

        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success : false ,
                message : "thsi is protected route for instructor only"
            })
        }
        next()

    }catch(err){
        return res.status(401).json({
            success : false ,
            message : "user role cannot be verified"
        })
    }
}

exports.isAdmin = async (req ,res , next)=>{
    try{

        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success : false ,
                message : "this is protected route for admin only"
            })
        }

        next()

    }catch(err){
        return res.status(401).json({
            success : false ,
            message : "user role cannot be verified"
        })
    }
}



// sign up 
//    send otp

// login

// reset password