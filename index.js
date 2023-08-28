const express = require ('express')
const app = express ()
const bodyParser = require ('body-parser')
app.use (bodyParser.urlencoded({extended:true}))
const dotenv = require ('dotenv')
dotenv.config()

const cors = require ('cors')
app.use(cors())
const jwt = require ('jsonwebtoken')
// const cloudinary = require ('cloudinary') 
// const { checkJWT } = require('./middleware/jwtMiddleware')
app.use(express.json({limit:"50mb"}))
require ('./connection/mongoose.connection')
let studentRouter = require('./routes/student.route')
// let staffRouter = require('./routes/staff.route')

app.use('/student', studentRouter)
// app.use('staff', staffRouter)


userModel = require ('./models/user.model')






app.listen("2300", ()=>{
    console.log("connected");
})