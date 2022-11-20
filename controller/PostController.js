const Post = require("../models/Post");
const User = require("../models/User");
exports.addPost = async (req, res, next) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json({ data: savedPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (post.creatorId === req.body.updatePost.creatorId) {
      post.img = updatePost.img,
      post.des = updatePost.des
      await post.save()
      res.status(200).json({ message: "Update Is Done" , post:post });
    } else {
      res.status(404).json({ message: "Creator Only Can Be Update" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (post.creatorId === req.params.userId) {
      post.deleteOne();
      res.status(200).json({ message: "delete done" });
    } else {
      res.status(404).json({ message: "Creator Only Can Be delete" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.addLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post.likes.includes(req.body.creatorLikeId)) {
      if (post.loves.includes(req.body.creatorLikeId)) {
       post.loves =  post.loves.filter((love) => {
          love !== req.body.creatorLikeId;
        });
        await post.save();
      }
      post.likes.push(req.body.creatorLikeId);
      await post.save();
      res.status(200).json({ message: "add Like done", likes: post.likes,loves:post.loves});
    } else {
      post.likes = post.likes.filter((like)=>{
        return like !== req.body.creatorLikeId
      })
      await post.save();
      res.status(200).json({ message: "remove Like done", likes: post.likes,loves:post.loves});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.addLove = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post.loves.includes(req.body.creatorLoveId)) {
      if (post.likes.includes(req.body.creatorLoveId)) {
        post.likes = post.likes.filter((like) => {
          return like !== req.body.creatorLoveId;
        });
        await post.save();
      }
      post.loves.push(req.body.creatorLoveId);
      await post.save();
      res.status(200).json({ message: "add love done", likes: post.likes,loves:post.loves});
    } else {
      post.loves = post.loves.filter((love) => {
        love !== req.body.creatorLoveId;
      });
      await post.save();
      res.status(200).json({ message: "remove love done", likes: post.likes,loves:post.loves});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (post) {
      res.status(200).json({ message: "fetch Post Success", post: post });
    } else {
      res.status(404).json({ message: "Can`t fetch the post" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getTimeLinePosts = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const currentUserPost = await Post.find({ creatorId: req.params.userId });
    const followingsPost = await Promise.all(
      currentUser.followings.map((followingId) => {
        return Post.find({ creatorId: followingId });
      })
    );
    res.status(200).json({
      posts: currentUserPost
        .concat(...followingsPost)
        .sort(
          (a, b) =>
            Date.parse(new Date(a.updatedAt)) -
            Date.parse(new Date(b.updatedAt))
        ),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getProfilePosts = async (req, res, next) => {
  try {
    const profilePosts = await Post.find({ creatorId: req.params.userId });
    res.status(200).json({ profilePosts: profilePosts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
exports.addComment = async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  const creator = await User.findById(req.params.userId);
  const commentData = {
    creatorId: req.params.userId,
    comment: req.body.comment,
    creatorUserName: creator.userName,
    creatorProfilePicture: creator.profilePicture,
  };
  try {
    post.comments.unshift(commentData);
    const postUpdate = await post.save();
    res
      .status(200)
      .json({ message: "Comment Uploaded ", data: postUpdate.comments[0] });
  } catch (error) {
    res.status(200).json(error);
  }
};
exports.getUpdateComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.status(200).json({ message: "Comment Uploaded ", post: post });
  } catch (error) {
    res.status(200).json(error);
  }
};
