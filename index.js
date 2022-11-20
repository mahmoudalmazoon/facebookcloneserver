const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const donenv = require("dotenv")
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const postRouter = require("./routes/Post");
const ConversationRouter = require("./routes/Conversation");

const MessageRouter = require("./routes/Message");
const multer = require("multer");
const path = require("path");
const app = express();
const isAuth = require("./middleware/isAuth")
const corsOptions = {
  origin: '*',
}
donenv.config()
app.use(cors(corsOptions))
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api",authRouter);
const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("upload done");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
app.use("/api/conversation",isAuth, ConversationRouter);
app.use("/api/message",isAuth, MessageRouter);
app.use("/api/user",isAuth, userRouter);
app.use("/api/post",isAuth, postRouter); 

// app.use((error, req, res, next) => {
//   console.log(error);
//   const status = error.statusCode || 500;
//   const message = error.message;
//   const data = error.data;
//   res.status(status).json({ message: message, data: data });
// });
const PORT = process.env.PORT || 5000
mongoose
  .connect(
      process.env.MONGOOD_URL
    )
  .then(
    app.listen(PORT, () => {
      console.log("connecting To database");
    })
  )
  .catch((err) => {
    console.log(err);
  });
