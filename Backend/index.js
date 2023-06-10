const express = require("express")
require("dotenv").config() ;

const app = express() ;

const userRoutes = require("./routes/User")
const courseRoutes = require("./routes/Course")
const paymentRoutes = require("./routes/Payment.js")
const profileRoutes = require("./routes/Profile")

const cookieParser =require("cookie-parser")
const cors = require("cors")
const {cloudinaryConnect} = require("./config/cloudinary")
const fileUpload = require("express-fileupload")

require("./config/database").dbconnect() ;
const Port = process.env.PORT || 4000

// middleware
app.use(express.json()) ;
app.use(cookieParser()) ;

// connect frontend with backend
app.use(
    cors({
        origin : "https://localhost:3000" ,
        credentials : true ,
    })
)

app.use(
    fileUpload({
        useTempFiles : true ,
        tempFileDir : "/tmp" ,
    })
)

// cloudConnection
cloudinaryConnect() ;

// routes

app.use("/api/v1/auth" , userRoutes) ;
app.use("/api/v1/profile" , profileRoutes) ;
app.use("/api/v1/course" , courseRoutes) ;
app.use("/api/v1/payment" , paymentRoutes) ;

app.get( "/" , (req, res)=>{
    return res.json({
        success: true ,
        message : `Your Server is up and running....`
    })
})
app.listen( Port , ()=>{
    console.log(`App id running at ${Port}`)
})