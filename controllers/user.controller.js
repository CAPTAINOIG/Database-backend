let userModel = require('../models/user.model')
const jwt = require("jsonwebtoken")
const cloudinary = require("cloudinary")
const { response } = require('express')
const nodemailer = require('nodemailer');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv')
dotenv.config()

const help = require('../models/help')



const pass = process.env.PASS;
const USERMAIL = process.env.USERMAIL;
const tokenStorage = new Map();

function generating() {
  return Math.floor(1000 + Math.random() * 9000)
}

const transporter = nodemailer.createTransport({
  // host: 'smtp.example.com',
  service: 'gmail',
  auth: {
    user: USERMAIL,
    pass: pass
  }
})


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

  let form = new userModel(req.body);
  const { firstName, lastName, email, password, phone, matric, dob, image, logo } = req.body;
  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password,
    phone,
    matric,
    dob,
    image,
    logo
  })
  // console.log(user);
  newUser.save()
    .then((result) => {
      console.log(result);
      res.status(200).json({ status: true, message: "User signed up successfully", result });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        res.status(409).json({ status: false, message: "Duplicate user found" });
      } else {
        res.status(400).json({ status: false, message: "Fill in appropriately" });
      }
    });
}

const userLogin = async (req, res) => {
  console.log(req.body);
  const { password, email } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const secrete = process.env.SECRET;
      user.validatePassword(password, (err, same) => {
        if (err) {
          res.status(500).json({ message: "Server error", status: false });
        } else {
          if (same) {
            const token = jwt.sign({ email }, secrete, { expiresIn: "10h" });
            console.log(token);
            res.status(200).json({ message: "User signed in successfully", status: true, token, user });
          } else {
            res.status(401).json({ message: "Wrong password, please type the correct password", status: false });
          }
        }
      });
    } else {
      res.status(404).json({ message: "Wrong email, please type the correct email", status: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", status: false });
  }
}

const getDashboard = (req, res) => {
  let token = (req.headers.authorization.split(" ")[1]);
  const secrete = process.env.SECRET;
  jwt.verify(token, secrete, (err, result) => {

    if (err) {
      console.log(err);
      res.send({ message: "Error Occured", status: false })
    }

    else {
      userModel.findOne({ email: result.email })
        .then((userDetail) => {
          console.log(userDetail);
          res.send({ message: "Congratulations", status: true, userDetail })

        })
    }
  })
}



const uploadFile = async (req, res) => {
  try {
      const { id, fileUpload } = req.body;
      // console.log(fileUpload);
      const uploadResult = await cloudinary.v2.uploader.upload(fileUpload);
      // console.log(uploadResult);

      await userModel.findOneAndUpdate({_id: id }, { $set: { image: uploadResult.secure_url } });

      console.log("Profile picture uploaded successfully.");
      res.status(200).json({
          message: "uploaded successfully.",
          status: true,
          uploadResult
          });
  } catch (error) {
      // console.error("Error uploading picture");
      res.status(500).json({ 
          error: "An error occurred while processing the request.",
          status: false
      });
  }
};



// const uploadFile = async (req, res) => {
//   const { email, fileUpload } = req.body
//   // await userModel.deleteOne({email})
//   // await userModel.findOne({email})
//   // console.log(fileUpload);
//   // .then(msg =>{
//   console.log(email);
//   // }).catch(err =>{
//   //   console.log(err);
//   // })


//   cloudinary.v2.uploader.upload(fileUpload)
//     .then((response) => {
//       // Code to handle successful Cloudinary upload
//       let myimage = response.secure_url;
//       console.log(myimage);

    //   userModel.findOneAndUpdate({ email }, { $set: { image: myimage } })
    //     .then((updatedUser) => {
    //       // Code to handle successful update of user model
    //       console.log(updatedUser);
    //       // Send a response to the client if needed
    //       res.status(200).json({
    //         status: true,
    //         response: updatedUser,
    //         message: 'Image uploaded successfully'
    //       });
    //     }).catch((err) => {
    //       // Code to handle Cloudinary upload or update error
    //       console.log(err);
    //       console.log('Error in Cloudinary upload or user model update');
    //       // Send an error response to the client if needed
    //       res.status(500).json({
    //         status: false,
    //         message: 'Error in Cloudinary upload or user model update',
    //         error: err.message
    //       });
    //     });
    // }).catch((err) => {
    //   // Code to handle Cloudinary upload or update error
    //   console.log(err);
    //   console.log('Error in Cloudinary upload or user model update');
    //   // Send an error response to the client if needed
    //   res.status(500).json({
    //     status: false,
    //     message: 'Error in Cloudinary upload or user model update',
    //     error: err.message
    //   });
    // });

const userHelp = (req, res) => {
  let formy = new help(req.body)
  formy.save()
    .then((response) => {
      console.log(response);
      res.send({ status: true, message: "Crash Reported Successfully", response })
    })
    .catch((err) => {
      console.log(err);
    })

}

const profile = ((req, res) => {
  userModel.find()
    .then((response) => {
      console.log(response);
      res.send({ status: true, message: "user signed up successfully", response })
    })
    .catch((err) => {
      console.log(err);
    })
})



const password = (req, res) => {
  const { email } = req.body;
  const resetToken = generating();
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 24); // Token expires in 24 hours

  tokenStorage.set(resetToken, { email, expires: expirationDate, pin: generating() });
  console.log(email);

  userModel.findOne({ email })
    .then((User) => {
      if (User === null) {
        console.log('user not found', email);
        res.status(500).json({ message: '❌ User not found', status: false })
      } else {
        console.log('✔ user found', email);
        const mailOptions = {
          from: USERMAIL,
          to: email,
          subject: 'Your OTP Code',
          text: `Your 4-digit PIN code is: ${resetToken}`,
          // html:,
        };
        return transporter.sendMail(mailOptions)
          .then((emailResult) => {
            console.log(emailResult);
            userModel.updateOne({ email }, { $set: { otp: resetToken } })
              .then(result => {
                console.log(result);
                res.status(200).json({ message: 'Email sent successful', status: true });
              }).catch(() => {
                res.status(500).json({ message: 'Error occur while updating Model', status: false });
              });
            // res.status(200).json({ message: 'Email sent successful' });
          }).catch((error) => {
            console.log(error);
            res.status(500).json({ message: 'Error occur while sending email', status: false });
          });
      }
    }).catch((err) => {
      console.log(err);
      console.error('Error in sendResetEmail:', err);
      res.status(500).json({ message: '❌ Internal server error', status: false });
    });

}




const resetPassword = (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Missing required data' });
    console.log('missig data');
  }
  console.log(email, otp, newPassword);

  userModel.findOne({ email, otp })
    .then(async (user) => {
      if (!user) {
        return res.status(500).json({ message: 'User not found' });
      }
      console.log('is ok');
      const hashPassword = await bcryptjs.hash(newPassword, 10);
      userModel.updateOne({ _id: user._id }, { password: hashPassword })
        .then(user => {
          res.status(200).json({ message: 'Password reset successful' });
          console.log('Password reset successful');
        }).catch((error) => {
          res.status(500).json({ message: 'Internal server error' });
          console.log('internal server error');
        })


    }).catch((error) => {
      console.log(error);
    })
}




module.exports = { registerUser, userLogin, getDashboard, uploadFile, ally, profile, userHelp, password, resetPassword }