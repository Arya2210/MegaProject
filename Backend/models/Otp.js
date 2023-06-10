const mongoose = require("mongoose") ;
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate")

const OTPSchema = new mongoose.Schema({
   email :{
       type : String,
       required : true ,

   } ,
   otp :{
       type : String ,
       required : true ,
   }
   ,
   createdAt :{
       type : Date ,
       default : Date.now() ,
    //    kitne time ke liye otp db me stored hoga fir time limit baad delete hoo jayga
       expires : 10*60 ,
   }

}) 

async function sendVerificationEmail(email , otp){
    try{
     const mailResponse = await mailSender(email , "verification Email from StudyNotion" , emailTemplate(otp)) ;
     console.log("Email Send Succesfully" , mailResponse.response) ;
    }catch(err){
       console.log("error occured while sending mails" , err) ;
       throw err ;
    }
}

OTPSchema.pre("save" , async function(next){
 //    this.email se jo email signup me bhara hh usse acces krte hh
 
 if(this.isNew){
   await sendVerificationEmail(this.email , this.otp) ;
 }
   next() ;
})
module.exports = mongoose.model("OTP" , OTPSchema) ;