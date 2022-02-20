const express = require("express")
const { auth } = require("../middlewares/auth.js")
const { loginController, signUpController , logoutController} = require("../controllers/user.js")
const multer = require("multer")
const MyErrors = require("../utils/customError.js")

//Setting Up Storage for the File

const fileStorage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, "UploadedFiles")
    },
    //This is for customising the name of the file.

    filename: (req, file, cb)=>{
        const randomString = new Date().getTime()
        const [name, extension] = file.originalname.split(".")
        cb(null, `${name}-${randomString}.${extension}`)
    }
})

const fileHandle = multer({
    fileFilter: (req, file, cb)=>{
        //Here we can peform the validation for the specific file type
        //It is validation for the field named post
        if(file.fieldname==="posts" && file.mimetype !== "application/pdf"){
            return cb(MyErrors.invalid({
                status: 415, message:"Please Upload PDF for Posts"
            }))
        }
        cb(null, true);
    },
    storage: fileStorage,
    //Setting up the file size
    limits:{
        fileSize: 1024 * 1024 * 1024
    },

})

router = express.Router()

router.post("/login", loginController)

router.post("/logout", logoutController)

router.get("/private",auth,  (req, res)=>{
    res.json({
        message: `Woohoo '${req.user.username}' you are Accessing Protected route`
    })
})

//This route is for the single file uploading using multer
router.post("/upload", auth, fileHandle.single("uploaded"), async (req, res)=>{
   
    res.json({
        message: res.__("File Received")
    })
})
//This is route for multiple file uploading using different fields
router.post("/upload-many", auth, fileHandle.fields([
    {
        name: "posts",
        maxCount: 2
    },
    {
        name: "products",
        maxCount:3
    }
]), async (req, res)=>{
   
    res.json({
        message: res.__("File Received")
    })
})

router.post("/signup", signUpController)


module.exports = router