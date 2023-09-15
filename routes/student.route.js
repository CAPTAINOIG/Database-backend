const express = require ('express')
const router = express.Router()

const {registerUser, userLogin, getDashboard, uploadFile, ally, profile, userHelp} = require('../controllers/user.controller')

router.get ("/all", ally)

router.post("/signup", registerUser)

router.post("/signin", userLogin)

router.post("/upload", uploadFile)

router.post("/help", userHelp)

// router.post("/socket", socketio)


router.get("/dashboard", getDashboard)

router.get("/userProfile", profile)


module.exports = router