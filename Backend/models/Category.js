const mongoose = require("mongoose") 

// model for ek category ke bhot sare courses

const categorySchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true ,
    },
    description :{
        type : String ,
    },
    courses : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "Course"
        }
    ],

});

module.exports = mongoose.model("Category" , categorySchema) ;