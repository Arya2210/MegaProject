const Tag = require("../models/Tag")


exports.createTag = async (req , res)=>{
    try{

        const {name , description} = req.body ;

        if( !name || !description){
            return res.status(400).json({
                success : false ,
                messgae : "All field is Neccessary"
            })
        }

        // create entry in db

        const tagdetails = await Tag.create({
            name : name ,
            description : description ,
        })
        console.log(tagdetails)

        return res.status(400).json({
            success : true ,
            messgae : "tag created succesfully"
        })
   
    }catch(err){
        return res.status(400).json({
            success : false ,
            messgae : "Tag not created"
        })
    }
}

// get all tags handler fiunction

exports.showAllTags = async(req , res)=>{
    try{
        //  sare tag nikalke lao jisme name and description hona jaruri hh
        const allTags = await  Tag.find({} , {name : true , description : true}) ;

        return res.status(400).json({
            success : true ,
            messgae : "all tag retuned succesfully"
        })


    }catch(err){
        return res.status(400).json({
            success : false ,
            messgae : err.message
        })
    }
}