const express = require("express")
const baseRoute = require("./routes/baseRoutes.js")
const userRoute = require("./routes/userRoutes.js")
const { errorHandler } = require("./middlewares/errorHandler.js")
require("./dbConnect.js")
const cors = require("cors")
const MyErrors = require("./utils/customError.js")
const csrf = require("csurf")
const cookieParser = require("cookie-parser")


const PORT = process.env.PORT || 3000
const app = express()

//This will be middleware for csrf Protection
//It will save the session key as a cookie and verify csrf with this key
//We will use this csrf middleware on specific routes only
const csrfProtect = csrf({cookie:true})
app.use(cookieParser())

//This is for parsing the body of incoming request
app.use(express.json())


const allowedOrigins = ["https://bparag123.herokuapp.com"]
//Here CORS  is applied on all the routes
//We can do it for specific routes also
app.use(cors({
    //This function will get the origin which is sending request to the server
    origin: function(origin, cb){
        console.log(origin);
        //If the origin is in a list of allowed Origins then it can access the resources
        if(allowedOrigins.includes(origin)) return cb(null, true)
        cb(MyErrors.invalid(500, "You are not allowed"))
    }
}))

app.get("/csrftest", csrfProtect, (req, res)=>{
    res.json({
        message: "You are allowed",
        csrf: req.csrfToken()
    })
})

app.post("/csrftest",csrfProtect, (req, res)=>{
    res.send("Your Are allowed to perform protected requests")
})

app.get("", baseRoute)

app.use("/user", userRoute)

// This is registration of my errorHandler middleware
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is Up and Running on Port : ${PORT}`);
})
