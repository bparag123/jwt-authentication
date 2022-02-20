const { JsonWebTokenError } = require("jsonwebtoken")
const MyErrors = require("../utils/customError.js")
const mongoose = require("mongoose");
const { MongoServerError } = require("mongodb");

const errorHandler = (error, req, res, next) => {
  
    if (error instanceof MyErrors) {
        return res.status(error.statusCode).json({
            message: res.__(error.errMsg)
        })
    }
    else if (error instanceof JsonWebTokenError) {

        return res.status(401).json({
            message: res.__(error.message)
        })
    }
    else if (error instanceof mongoose.Error.ValidationError || error instanceof MongoServerError) {

        return res.status(500).json({
            message: res.__(error.message)
        })
    }
    else{
        return res.status(500).json({
            message: res.__(error.message)
        })
    }
}

module.exports = { errorHandler }