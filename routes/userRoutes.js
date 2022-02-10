const express = require("express")
const { auth } = require("../middlewares/auth.js")
const { loginController, signUpController , logoutController} = require("../controllers/user.js")

router = express.Router()

router.post("/login", loginController)

router.post("/logout", logoutController)

router.get("/private",auth,  (req, res)=>{
    res.json({
        message: `Woohoo '${req.user.username}' you are Accessing Protected route`
    })
})

router.post("/signup", signUpController)


module.exports = router