const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema(
  {
    creatorId: {
      type: String,
      required: true,
    },
    des: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    loves: {
      type: Array,
      default: [],
    },
    comments: {
      type: [
        {
          comment: {
            type: String,
          },
          creatorId: {
            type: String,
          },
          Date: {
            type: Date,
            default:()=> Date.now(),
          },
          creatorProfilePicture: {
            type: String,
          },
          creatorUserName: {
            type: String,
          },
        },
      ],
      default: [],
      
    },
    LikeImg: {
      type: String,
      default: "http://localhost:5000/images/like.png",
    },
    LoveImg: {
      type: String,
      default: "http://localhost:5000/images/heart.png",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", postSchema);
