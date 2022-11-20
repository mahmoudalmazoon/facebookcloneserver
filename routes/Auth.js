const express = require("express");
const router = express.Router();
const AuthController = require("../controller/AuthController");
router.post("/signup", AuthController.SignUp);
router.post("/login", AuthController.login);
router.post("/logout/:userId", AuthController.logout);
router.post("/forget/sendmail",AuthController.SendPassword)
module.exports = router;
