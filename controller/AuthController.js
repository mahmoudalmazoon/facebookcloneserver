const User = require("../models/User");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.SignUp = (req, res, next) => {
  const userName = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const from = req.body.from;
  const Relationship = req.body.Relationship;
  const mobileNumber = req.body.mobileNumber;
  const city = req.body.city;
  const nickname = req.body.nickname;
  const Gender = req.body.Gender;
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      bcrypt
        .hash(password, 12)
        .then((hashed) => {
          const user = new User({
            userName: userName,
            email: email,
            password: hashed,
            Gender: Gender,
            from: from,
            Relationship: Relationship,
            mobileNumber: mobileNumber,
            nickname: nickname,
            city: city,
          });
          return user.save();
        })
        .then((result) => {
          if (!result) {
            return res.status(500).json({ message: "can't create Email" });
          }
          res.status(201).json({ message: "createEmail" });
          return result;
        })
        .then((result) => {
          User.findById("6378961a5e266b0d167f8385").then((user)=>{
            console.log(user)
            console.log(result._id)
            user.followers.push(result._id)
            user.save()
          });
        })
        .catch((error) => {
          res.status(404).json({ message: error.message });
        });
    } else {
      res.status(404).json({ message: "Email Create Before" });
    }
  });
};
exports.login = (req, res, next) => {
  const userName = req.body.userName;
  const email = req.body.email;
  const Password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Email Not Found" });
      }
      bcrypt
        .compare(Password, user.password)
        .then((doMatch) => {
          if (!doMatch) {
            return res.status(500).json({ message: "Password Not Match" });
          }
          user.online = true;
          return user.save();
        })
        .then((user) => {
          const token = JWT.sign(
            { userName: user?.userName, userId: user?._id?.toString() },
            "somesupersecrets",
            { expiresIn: "1d" }
          );
          const { password, ...other } = { ...user._doc };
          return res.status(200).json({ user: other, token: token });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.logout = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    user.online = false;
    await user.save();
    res.status(200).json({ message: "logout done" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.SendPassword = async (req, res, next) => {
  const Receiver = await User.findOne({ email: req.body.email });
  const token = JWT.sign(
    { userName: Receiver.userName, userId: Receiver._id.toString() },
    "somesupersecrets",
    { expiresIn: "5m" }
  );
  const transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: "mahmoudalmazoon@outlook.com",
      pass: "Hh01006517416",
    },
  });
  const mailOptions = {
    from: "mahmoudalmazoon@outlook.com",
    to: Receiver.email,
    subject: "ZonaBook",
    text: `http://localhost:3000/resetpassword/${token}/${Receiver._id}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("error");
      console.log(error);
      res.status(404).json({ message: error });
    } else {
      res.status(200).json({ info: info.response });
      console.log("Email sent: " + info.response);
    }
  });
};
