const express = require("express")
router = express.Router()

router.get("", (req, res)=>{
    res.send("This is Home Route")
})

module.exports = router