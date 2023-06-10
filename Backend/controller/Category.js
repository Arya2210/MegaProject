const Category = require("../models/Category") ;


exports.createCategory = async(req ,res)=>{

    try{

        const {name , description} = req.body
        if(!name){
            return res.status(400).json({success : false , 
                                        message : "All field are required"}) ;
        }

        const CategoryDetails = await Category.create({
                                          name : name ,
                                          description : description ,  
        })
        console.log(CategoryDetails) ;

        return res.status(200).json({
            success : true ,
            message :"Category Created "
        })

    }catch(err){
        return res.status(400).json({
            success : false ,
            message :err.message
        })
    }

}
exports.showAllCategory = async (req , res)=>{

    try{

        const allCategory = await Category.find({} , {name : true , description :true}) 

        return res.status(400).json({
            success : true ,
            data : allCategory ,
        })

    }catch(err){
        return res.status(400).json({
            success : false ,
            message :err.message 
        })
    }

}

exports.categoryPageDetails = async(req , res)=>{

    try{
    // getcategory id
    const {categoryId} = req.body 
    // get cousrses for specified categoryId
    const selectedCategory = await Category.findById(categoryId).populate("courses").exec()
    // valiadtion
    if(!selectedCategory){
        return res.status(400).json({
            success : false ,
            message :"Course nhi mila"
        })
    }
    // get courses for different category means category ke alawa baki course lake do
    const differentCategory=  await Category.find({
                                                   _id : {$ne : categoryId} ,
                                                 }).populate("courses").exec() ;
    // HW =: get top selling course
    
    // return response
    return res.status(200).json({
        success : true ,
        message :"data fetched" ,
        data :{
            selectedCategory ,
            differentCategory ,
        }
    })
    }catch(err){
        return res.status(400).json({
            success : false ,
            message :err.message ,
        })
    }
}