const mongoose = require("mongoose") ;

require("dotenv").config() ;

exports.dbconnect = ()=>{
    mongoose.connect( process.env.BASE_URL ,{
        useNewUrlParser : true,
        useUnifiedTopology: true ,
    })
    .then( ()=>{
        console.log("Db conected succesfully") 
    }).catch( (err)=>{
       console.log("Not Connected") ;
       process.exit(1) ;
    }
    )
}

