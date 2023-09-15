const express = require ('express')
const app = express ()
const bodyParser = require ('body-parser')
app.use (bodyParser.urlencoded({extended:true, limit:"50mb"}))
const dotenv = require ('dotenv')
dotenv.config()
const cloudinary = require ('cloudinary')
const cors = require ('cors')
app.use(cors())


app.use(express.json({limit:"50mb"}))
require ('./connection/mongoose.connection')
let studentRouter = require('./routes/student.route')


app.use('/student', studentRouter)

userModel = require ('./models/user.model')



cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 



    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });

app.get ("/", (req,res)=>{
  res.send("Hello world")
})


let connection = app.listen("2300", ()=>{
    console.log("connected");
})

let socketClient = require ("socket.io")
let io = socketClient(connection, {
  cors: {origin: "*"}
})
io.on("connection", (socket)=>{
  console.log(socket.id);
  // console.log("A user connected successfully");
  socket.on("sendMsg", (message)=>{
    console.log(message);
    io.emit("broadcastMsg", message)
  })



  socket.on("disconnect", ()=>{
    // console.log("A user disconnected");

  })
})