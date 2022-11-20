const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 3,
      max: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    profilePicture: {
      type: String,
      default: "http://localhost:5000/images/noAvatar.png",
    },
    coverPicture: {
      type: String,
      default: "http://localhost:5000/images/Default.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: ["6378961a5e266b0d167f8385"],
    },
    des: {
      type: String,
    },
    posts: {
      type: Array,
      default: [],
    },
    from: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    Relationship: {
      type: String,
      default: "",
    },
    mobileNumber: {
      type: String,
      default: "",
    },
    online: {
      type: Boolean,
      default: false,
    },
    nickname: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    Gender:{
      type:String,
      default:"other"
    },
    friendrequest: {
      type: [
        {
          creatorProfilePicture: {
            type: String,
          },
          Date: {
            type: Date,
            default: () => Date.now(),
          },
          creatorUserName: {
            type: String,
          },
          creatorId:{
            type:String
          }
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
