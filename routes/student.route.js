const express = require ('express')
const router = express.Router()

const {registerUser, userLogin, getDashboard} = require('../controllers/user.controller')


router.post("/signup", registerUser)

router.post("/signin", userLogin)

router.get("/dashboard", getDashboard)


module.exports = router