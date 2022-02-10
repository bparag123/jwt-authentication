const express = require("express")
const baseRoute = require("./routes/baseRoutes.js")
const userRoute = require("./routes/userRoutes.js")
const {errorHandler} = require("./middlewares/errorHandler.js")
require("./dbConnect.js")

const PORT = process.env.PORT || 3000
const app = express()

app.get("", baseRoute)
app.use(express.json())
app.use("/user", userRoute)

// This is registration of my errorHandler middleware
app.use(errorHandler)

app.listen(PORT, ()=>{
    console.log(`Server is Up and Running on Port : ${PORT}`);
})
