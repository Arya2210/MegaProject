const mongoose = require("mongoose") ;
// ek insaan ki rating and review
const ratingandreviews = new mongoose.Schema({
    
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        required : true ,
        ref : "User"
    },
    rating :{
        type : Number ,
        required : true ,

    },
    review:{
        type : String ,
        trim : true ,
    },
    course:{
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Course" ,
        index : true ,
        required : true ,
    }

})

module.exports = mongoose.model("RatingAndReview" ,ratingandreviews) ;