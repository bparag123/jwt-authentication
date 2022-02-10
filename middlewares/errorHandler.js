const { JsonWebTokenError } = require("jsonwebtoken")
const MyErrors = require("../utils/customError.js")
const mongoose = require("mongoose");
const { MongoServerError } = require("mongodb");

const errorHandler = (error, req, res, next) => {
  
    if (error instanceof MyErrors) {
        return res.status(error.statusCode).json({
            message: error.errMsg
        })
    }
    else if (error instanceof JsonWebTokenError) {

        return res.status(400).json({
            message: error.message
        })
    }
    else if (error instanceof mongoose.Error.ValidationError || error instanceof MongoServerError) {

        return res.status(400).json({
            message: error.message
        })
    }
    else{
        return res.status(400).json({
            message: error.message
        })
    }
}

module.exports = { errorHandler }