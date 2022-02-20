const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const valid = require("validator")
const MyErrors = require("../utils/customError")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
            validator: (value) => valid.isEmail(value),
            message: data => `${data.value} is not valid`
        }
    },
    password: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: false
    },
    refreshToken: String
})

//This is instance method which will check the hashed password
userSchema.methods.checkPassword = async function (password) {
    
    let isMatched = await bcrypt.compare(password, this.password)
    
    return isMatched
}

//This Function will use to create Refresh/ Access Token based on the argument
userSchema.methods.getToken = function ({exp, secret}) {
    
    let token;
    if (exp) {
        token = jwt.sign({ id: this._id }, secret, {
            // This time is in second
            expiresIn: exp
        })
    } else {
        token = jwt.sign({ id: this._id },secret)
    }

    return token
}

//This method will execute before the user is saved
userSchema.pre("save", async function (next) {
    //If Password is modified then only we need to rehash it
    if (this.isModified("password")) {
        let hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword
    }
    next()
})

module.exports = new mongoose.model("User", userSchema)