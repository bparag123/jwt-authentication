const mongoose = require("mongoose");
require("dotenv").config()

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: "true",
    useUnifiedTopology: true
}, (error, connectionObject) => {
    if (error) {
        console.log("Couldn't Connect to Database");
    }
    else {
        console.log("Database Connection Successfull");
    }
})

