let userModel = require('../models/user.model')
const jwt = require("jsonwebtoken")
const cloudinary = require("cloudinary")
const { response } = require('express')
const help = require('../models/help')


const ally = (req, res) => {
    let form = userModel.find()
        .then((result) => {
            console.log(result);
            res.send({ status: true, message: "user signed up successfully", result })
        })
        .catch((err) => {
            console.log(err);
        })
}

const registerUser = (req, res) => {
    let form = new userModel(req.body)
    form.save()
        .then((result) => {
            console.log(result);
            res.send({ status: true, message: "user signed up successfully", result })
        })
        .catch((err) => {
            console.log(err);
        })
}

const userLogin = async (req, res) => {
    console.log(req.body);
    let { password, email } = req.body
    userModel.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                // res.send({message:"email exist", status:true})
                user.validatePassword(password, (err, same) => {
                    // res.send({message:"email exist", status:true})
                    if (err) {
                        res.send({ message: "server error", status: false })
                    }
                    else {
                        if (same) {
                            let token = jwt.sign({ email }, "secrete", { expiresIn: "10h" })
                            console.log(token);
                            res.send({ message: "User Signed in Successfully", status: true, token })
                        } else {
                            res.send({ message: "Wrong password", status: false })
                        }
                    }
                })
            } else {
                res.send({ message: "wrong email", status: false })

            }
        })
        .catch((err) = {
            if(err) {
                res.send({ message: "server error", status: false })
                console.log(err);

            }
        })
}

const getDashboard = (req, res) => {
    let token = (req.headers.authorization.split(" ")[1]);
    jwt.verify(token, "secrete", (err, result) => {
        if (err) {
            console.log(err);
            res.send({ message: "Error Occured", status: false })

        } else {
            userModel.findOne({ email: result.email })
                .then((userDetail) => {
                    res.send({ message: "Congratulations", status: true, userDetail })
                    console.log(result);

                })
        }
    })
}

const uploadFile = (req, res) => {
    let image = req.body.fileUpload
    cloudinary.v2.uploader.upload(image, (error, result) => {
    })
        .then((response) => {
            let myimage = response.secure_url
            userModel.findByIdAndUpdate(req.body.id, { $set: { image: req.body.myimage, status: true } })
                .then((response) => {
                    console.log(response);
                    res.send({ message: "image uploaded successfully", statue: true, myimage })
                })
                .catch((err) => {
                    console.log(err);
                })

        }).catch((err) => {
            console.log(err);
        })

}


const userHelp = (req,res)=>{
    let formy = new help(req.body)
    formy.save()
    .then((response)=>{
        console.log(response);
        res.send({status:true, message: "Crash Reported Successfully", response})
    })
    .catch((err)=>{
        console.log(err);
    })

}

const profile = ((req, res)=>{
    userModel.find()
    .then((response)=>{
        console.log(response);
        res.send({ status: true, message: "user signed up successfully", response })
    })
    .catch((err)=>{
        console.log(err);
    })
})

// const socketio = (req,res) =>{
//     let updateSocket = new socketModel(req.body)
//     updateSocket.save()
//     .then((response) =>{
//         console.log(response);
//         let socketClient = require ("socket.io")
//         let io = socketClient(connection, {
//             cors: {origin: "*"}
//         })
//         io.on("connection", (socket)=>{
//             console.log(socket.id);
//             // console.log("A user connected successfully");
//       socket.on("sendMsg", (message)=>{
//         console.log(message);
//         io.emit("broadcastMsg", message)
//       })
      
    
      
//       socket.on("disconnect", ()=>{
//           // console.log("A user disconnected");
          
//         })
//     })
// })
// .catch((err)=>{
//     console.log(err);
// })
// }





module.exports = { registerUser, userLogin, getDashboard, uploadFile, ally, profile, userHelp}