const nodemailer = require("nodemailer") ;
require("dotenv").config() ;

// otp ko mail me send krne ke liye it act as a tranporter


const mailSender  = async (email , title , body)=>{
    const MailHost = process.env.MAIL_HOST ;
     try{
         let transporter = nodemailer.createTransport({
             host : `${process.env.MAIL_HOST}`,
             secure : true ,
             
             auth : {
                 user : `${process.env.MAIL_USER}`,
                 pass : `${process.env.MAIL_PASSWORD}`,
             }
         })

         let info = await transporter.sendMail({
             from : "StudyNotion" ,
             to : `${email}` ,
             subject :`${title}` ,
             html:  `${body}`
         })
         console.log(info) ;
         return info ;
     }
     catch(error){
          console.log(error.message) ;
     }
}

module.exports = mailSender ;