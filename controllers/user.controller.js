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

const Captain =
  "https://res.cloudinary.com/dbp6ovv7b/image/upload/v1715783819/tvf5apwj5bwmwf2qjfhh.png";


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
  console.log(newUser);
  newUser.save()
    .then((result) => {
      console.log(result);
      res.status(200).json({ status: true, message: "User signed up successfully", result });
      console.log('✔ user found', email);
      const mailOptions = {
        from: process.env.USER,
        to: email,
        subject: "Welcome to Captain College",
        html: `
          <div style="background-color: rgb(4,48,64); padding: 20px; color: rgb(179,148,113); border-radius: 5px">
            <img src="${Captain}" alt="Captain College Logo" style="max-width: 150px; height: 130px; margin-bottom: 20px; margin-left: 300px;">
            <div style="text-align: center;">
            <p style="font-size: 18px;">Hello, ${firstName}!</p>
            <p style="font-size: 16px;">Welcome to Captain College! We're thrilled that you've chosen to register with us.</p>
            <p style="font-size: 16px;">If you have any questions or need assistance, feel free to reach out @abdullahisamsudeen@gmail.com.</p>
            <p style="font-size: 16px;">Thank you for joining us.</p>
            <p style="font-size: 16px;">Best regards,</p>
            <p style="font-size: 16px;">The Captain College Team</p>
            </div>
          </div>
        `,
      };
        return transporter.sendMail(mailOptions)
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
  console.log(email);
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
  }
  console.log('missig data');
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