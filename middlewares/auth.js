const jwt = require("jsonwebtoken");
const User = require("../models/user");
const MyErrors = require("../utils/customError.js");

const auth = async (req, res, next) => {
    
    const authorization = req.headers.authorization;
    if (authorization && authorization.startsWith("Bearer")) {
        let token = authorization.split(" ")[1]
        try {
            let payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

            let user = await User.findById(payload.id, "-password -__v")
            console.log(user);
            if (!user) {
                return next(MyErrors.invalid(400, "User Not Found"))
            }

            req.user = user
            next()
            
        } catch (error) {
            next(error)
        }
    }
    else {
        next(MyErrors.invalid(400, "Please Provide Authorization Token"))
    }

}


module.exports = { auth }