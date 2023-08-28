const express = require ('express')
const app = express ()
const bodyParser = require ('body-parser')
app.use (bodyParser.urlencoded({extended:true}))
const dotenv = require ('dotenv')
dotenv.config()

const cors = require ('cors')
app.use(cors())


// app.use(express.json({limit:"50mb"}))
require ('./connection/mongoose.connection')
let studentRouter = require('./routes/student.route')


app.use('/student', studentRouter)

// userModel = require ('./models/user.model')






app.listen("2300", ()=>{
    console.log("connected");
})