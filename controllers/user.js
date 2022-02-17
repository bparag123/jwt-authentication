const jwt = require("jsonwebtoken")
require("dotenv").config()
const MyErrors = require("../utils/customError.js")
const User = require("../models/user.js")

const loginController = async (req, res, next) => {
    let { username, password } = req.body
    if (username && password) {
        //Finding User
        let user = await User.findOne({ username })
        if (!user) {
            return next(MyErrors.invalid(400, "User not Found"))
        }

        let isMatched = await user.checkPassword(password)
        if (!isMatched) {
            return next(MyErrors.invalid(400, "Invalid Password"))
        }

        //Generating Access and Refresh Token
        let accessToken = user.getToken({exp: 60*60, secret: process.env.ACCESS_TOKEN_SECRET})
        let refreshToken = user.getToken({secret: process.env.REFRESH_TOKEN_SECRET})
        //Updating User with Refresh Token
        user.refreshToken = refreshToken
        await user.save()
        return res.send({ accessToken, refreshToken })
    }

    else {
        next(MyErrors.invalid(400, "Please Provide Credentials"))
    }
}

const signUpController = async (req, res, next) => {
    let user = new User(req.body)
    try {
        user = await user.save()
        res.send(user)
    } catch (error) {
        next(error)
    }
}

const logoutController = async (req, res, next) => {
    const { refresh_token } = req.body
    try {
        const data = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)
        
        let user = await User.findOne({ _id: data.id })
        if (!user) {
            return next(MyErrors.invalid(400, "User not Found"))
        }
        if (!user.refreshToken) {
            return next(MyErrors.invalid(403, "Please Login to Access this End Point"))
        }
        if (user.refreshToken !== refresh_token) {
            return next(MyErrors.invalid(403, "Invalid Refresh Token"))
        }

        //Deleting The Field refreshToken From User
        user.refreshToken = undefined
        await user.save()
        res.json({
            message: "Logged out"
        })
    } catch (error) {
        return next(error)
    }

}


module.exports = { loginController, signUpController, logoutController }