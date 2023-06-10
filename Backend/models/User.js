const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
    enum: ["Admin", "Student", "Instructor"],
  },

  active : {
    type : Boolean ,
    default : true ,
  },
  approved :{
    type: Boolean ,
    default : true ,
  } ,
  


  additionalDetails: {
    // profile model ki details
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
  },
  courses:[{
    type : mongoose.Schema.Types.ObjectId ,
   
    ref:"Course"
    
  }] ,
  token:{
     type : String ,

  },
  resetPassswordExpires :{
    type : Date,
    
  }
  ,
  image:{
    type : String ,
    required : true,
    
  },
  courseProgress : [{
      type : mongoose.Schema.Types.ObjectId ,
      ref :"courseProgress"
  }]


},
{timestamps : true} 
);

// async function updatePasswordMail(email){
//   try{
//   const sendMail  = await mailSender(email , "password updated succesfully" , "YOU have updated the password") ;
//   console.log("passsword updated succesfully")
//   }catch(err){
//      console.log(err.message) ;
//      throw err ;
//     }
  
// }

// userSchema.post( "save", (next)=>{

  
//   await updatePasswordMail(this.email  ) ;
//   next() ;
// })

module.exports = mongoose.model("User" , userSchema) ;
