const express = require("express")
const { auth } = require("../middlewares/auth.js")
const { loginController, signUpController , logoutController} = require("../controllers/user.js")
const multer = require("multer")



//Setting Up Storage for the File

const fileStorage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, "UploadedFiles")
    },

    filename: (req, file, cb)=>{
        const randomString = new Date().getTime()
        const [name, extension] = file.originalname.split(".")
        cb(null, `${name}-${randomString}.${extension}`)
    }
})

const fileHandle = multer({
    fileFilter: (req, file, cb)=>{
        //Here we can peform the validation for the specific file type
        
        cb(null, true);
    },
    storage: fileStorage,
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

router.post("/upload", auth, fileHandle.single("uploaded"), (req, res)=>{
    
    res.json({
        message: "File Received"
    })
})

router.post("/signup", signUpController)


module.exports = router