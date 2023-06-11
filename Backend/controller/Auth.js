const User = require("../models/User");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken") ;
const Profile = require("../models/Profile")
require("dotenv").config() ;
// otp generator

exports.sendOTP = async (req, res) => {
  console.log("heoo")
  try {
    const { email } = req.body;

    const checkuserPresent = await User.findOne({ email });

    if (checkuserPresent) {
      return res.status(401).json({
        success: false,
        message: "user Already Exist",
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp generator :", otp);
    // check ki generated otp unique hh ya nhi

    const result = await OTP.findOne({ otp: otp });
    // bekar code while wla
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: otp });
    }
    //   create otp entry in db for certain time limit
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);

    console.log("otp" ,  otpBody);

    return res.status(200).json({
      success: true,
      message: "user otp send succesfully",
      otp,
    });
  } catch (err) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

// sign up

exports.signUp = async (req, res) => {
  try {
    const {  firstName,
      lastName,
      email,
      password,
      confirmPassword,

      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validate
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !otp ||
      !confirmPassword
    ) {
      return res.status(403).json({
        success: false,
        message: "All field are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "password does not match",
      });
    }

    // check for existing user

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(521).json({
        success: false,
        message: "user email Already Exist",
      });
    }

    // find most recent otp

    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log("otp", recentOtp);

    // validate otp
    if (recentOtp.length === 0) {
      // otp not found
      return res.status(511).json({
        success: false,
        message: "otp not found",
      });
    }
    // check krenge ki generated otp is not equal to db stored otp
    // abhi hm otp ka object banayenge , user ka object otp verify ke baad banega
    else if (otp !== recentOtp[0].otp) {
      return res.status(501).json({
        success: false,
        message: "Invalid otp",
      });
    }

    //  hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // profile detail
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    // create entry in db
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contactNumber,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    });

    return res.status(200).json({
        success : true ,
           
        message : "User Sign up succesfully",
        user ,
    })

  } catch (err){
    return res.status(500).json({
        success : false ,
        message : "sign up not success",
        error : err.message
        
    })
  }
};

// login

exports.login = async(req , res)=>{
    try{
    
        const {email , password} = req.body ;
    //   vaidation data
        if(!email || !password){
            return res.status(401).json({
                success : false ,
                message : "All input field are required"
            })
        }

        const user = await User.findOne({email}).populate("additionalDetails") ;
        if(!user){
            return res.status(401).json({
                success : false ,
                message : "user not registered"
            })
        }
//    password -> input wala | user.password -> db me saved wala
        if(await bcrypt.compare(password , user.password)){

            const payload = {
                email : user.email ,
                id : user._id ,
                accountType : user.accountType ,

            }
            // create token
            const token =  jwt.sign(payload ,process.env.JWT_SECRET , {
                expiresIn : "2h" ,
            });

            user.token = token ;
            user.password = undefined ;


            // generate cookie
            const options = {
                expiresIn : new Date (Date.now() + 3*24*60*1000),
                httpOnly : true ,
            }
            res.cookie("token" , token , options).status(200).json({
                  success : true ,
                  token ,
                  user ,
                  message : "logged in succesfully"
            })
        }
        else{
            return res.status(401).json({
                success : false ,
                message : "Password does not match"
            })
        }
        

    }catch(err){
        return res.status(500).json({
            success : false ,
            message : "Login Failure"
        })
        
    }
}

// change password

exports.changePassword = async ( req , res)=>{

    // get data from req body
    // get  newpassword,  confirmpassword
    // validation
    // update pwd in db
    // send mail - password updated
    // return response
    try{
        const {email  , newPassword , confirmPassword} = req.body ;
        if( !email ||  !newPassword || !confirmPassword ){
          return res.status(400).json({
            success : false ,
            message : "all field are required"
          })
        }
         if(newPassword !== confirmPassword ){
          return res.status(400).json({
            success : false ,
            message : "password does not matched"
          })

         }
        const hashnewPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOneAndUpdate( 
                                               {email : email} ,
                                               {
                                                 $push:{password : hashnewPassword} 
                                               },
                                               {new : true}
        )
        

        return res.status(200).json({
          success : true ,
          message : "password updated"
        })
        


  

    }catch(err){
        return res.status(401).json({
            success : false ,
            message : "try changing password later"
        })
    }
}
