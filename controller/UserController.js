const User = require("../models/User");
const bcrypt = require("bcrypt");
exports.updateUser = (req, res, next) => {
  const oldPassword = req.body.oldPassword;
  const userId = req.params.userId;
  User.findById(userId)
    .then((user) => {
      if (req.body.userId === userId || user.isAdmin) {
        bcrypt
          .compare(oldPassword, user.password)
          .then((doMatch) => {
            if (!doMatch) {
              return res
                .status(500)
                .json({ message: "Should Write The Correct Old Password" });
            }
            return User.findByIdAndUpdate(userId, {
              $set: req.body,
            }).then((update) => {
              res.status(200).json({ message: "The Email Is Updated" });
            });
          })
          .catch((err) => {
            res.status(500).json({ message: "someThing Is Wrong" });
          });
      } else {
        res.status(403).json({ message: "Can Update Only Your Account" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
exports.DeleteUser = (req, res, next) => {
  const oldPassword = req.body.oldPassword;
  const userId = req.params.userId;
  User.findById(userId)
    .then((user) => {
      if (req.body.userId === userId || user.isAdmin) {
        bcrypt
          .compare(oldPassword, user.password)
          .then((doMatch) => {
            if (!doMatch) {
              return res
                .status(500)
                .json({ message: "Should Write The Correct Old Password" });
            }
            return User.findByIdAndDelete(userId).then((update) => {
              res.status(200).json({ message: "The Email Is Delete" });
            });
          })
          .catch((err) => {
            res.status(500).json({ message: "someThing Is Wrong" });
          });
      } else {
        res.status(403).json({ message: "Can Update Only Your Account" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
exports.getUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then((user) => {
      const { password, ...other } = user._doc;
      res.status(200).json({ user: other });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
exports.getUserByName = async (req, res, next) => {
  const Search = req.body.userName;
  const Users = await User.find({
    userName: { $regex: "^" + Search, $options: "i" },
  });
  console.log(Users);
  let UsersSent = [];
  Users.map((User) => {
    const { password, ...other } = User._doc;
    UsersSent.push(other);
  });
  try {
    res.status(200).json({ Users: UsersSent });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
exports.addFollow = async (req, res, next) => {
  if (req.body.userId !== req.params.userId) {
    try {
      const CurrentUser = await User.findById(req.body.userId);
      const followUser = await User.findById(req.params.userId);
      if (!followUser.followers.includes(req.body.userId)) {
        await CurrentUser.updateOne({
          $push: { followings: req.params.userId },
        });
        await followUser.updateOne({
          $push: { followers: req.body.userId },
        });
      }
      res.status(200).json({ message: "follow done" });
    } catch (error) {
      res.status(404).json({ message: "You already follow" });
    }
  } else {
    res.status(403).json({ message: "Can't follow Your Self" });
  }
};
exports.UnFollow = async (req, res, next) => {
  if (req.body.userId !== req.params.userId) {
    try {
      const CurrentUser = await User.findById(req.body.userId);
      const followUser = await User.findById(req.params.userId);
      if (followUser.followings.includes(req.body.userId)) {
        await CurrentUser.updateOne({
          $pull: { followers: req.params.userId },
        });
        await followUser.updateOne({
          $pull: { followings: req.body.userId },
        });
      }
      res.status(200).json({ message: "unfollow done" });
    } catch (error) {
      res.status(404).json({ message: "You already follow" });
    }
  } else {
    res.status(403).json({ message: "Can`t unFollow Your Self" });
  }
};
exports.FriendRequest = async (req, res, next) => {
  if (req.body.userId !== req.params.userId) {
    try {
      const CurrentUser = await User.findById(req.body.userId);
      const Friend = await User.findById(req.params.userId);
      if (!Friend.friends.includes(req.body.userId)) {
        Friend.friendrequest.push({
          creatorProfilePicture: CurrentUser.profilePicture,
          creatorUserName: CurrentUser.userName,
          creatorId: CurrentUser._id,
        });
        await Friend.save();
      }

      res.status(200).json({ message: "request friend done", Friend: Friend });
    } catch (error) {
      res.status(404).json({ message: "You already Friend" });
    }
  } else {
    res.status(403).json({ message: "Can't Friend Your Self" });
  }
};
exports.RemoveFriendRequest = async (req, res, next) => {
  if (req.body.userId !== req.params.userId) {
    try {
      const Current = await User.findById(req.params.userId);
      Current.friendrequest = Current.friendrequest.filter((r) => {
        return r.creatorId !== req.body.userId;
      });
      await Current.save();
      res.status(200).json({ message: "removeDone", user: Current });
    } catch (error) {
      res.status(404).json({ error: error });
    }
  } else {
    res.status(403).json({ message: "Can't Friend Your Self" });
  }
};
exports.AddFriend = async (req, res, next) => {
  if (req.body.userId !== req.params.userId) {
    try {
      const CurrentUser = await User.findById(req.body.userId);
      const Friend = await User.findById(req.params.userId);
      if (!Friend.friends.includes(req.body.userId)) {
        await CurrentUser.updateOne({
          $push: { friends: req.params.userId },
        });
        await Friend.updateOne({
          $push: { friends: req.body.userId },
        });
      }
      res.status(200).json({ message: "Friend done" });
    } catch (error) {
      res.status(404).json({ message: "You already Friend" });
    }
  } else {
    res.status(403).json({ message: "Can't Friend Your Self" });
  }
};
exports.UnFriend = async (req, res, next) => {
  if (req.body.userId !== req.params.userId) {
    try {
      const CurrentUser = await User.findById(req.body.userId);
      const Friend = await User.findById(req.params.userId);
      if (Friend.friends.includes(req.body.userId)) {
        await CurrentUser.updateOne({
          $pull: { friends: req.params.userId },
        });
        await Friend.updateOne({
          $pull: { friends: req.body.userId },
        });
      }
      res.status(200).json({ message: "unFriend done" });
    } catch (error) {
      res.status(404).json({ message: "You already Friend" });
    }
  } else {
    res.status(403).json({ message: "Can`t unFriend Your Self" });
  }
};
exports.getUsers = async (req, res, next) => {
  const Users = await User.find();
  res.status(200).json({ Users: Users });
};
exports.getProfileFriends = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const friends = await Promise.all(
      currentUser.friends.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendslist = [];
    friends.map((friend) => {
      const { _id, profilePicture, userName } = friend;
      friendslist.push({ _id, profilePicture, userName });
    });
    res.status(200).json({ friends: friendslist });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
exports.getActiveFriends = async (req, res, next) => {
  const friends = req.body.friends;
  try {
    const activeFriends = await Promise.all(
      friends.map((friendId) => {
        return User.findById(friendId);
      })
    );
    res.status(200).json({ activeFriends: activeFriends });
  } catch (error) {
    res.status(404).json({ error: error });
  }
};
exports.updateprofile = async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  try {
    user.profilePicture = req.body.profilePicture;
    await user.save();
    res.status(200).json({ message: "updateProfilePictureDone", user: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "updateProfilePictureFile" });
    console.log(error);
  }
};
exports.updateCover = async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  try {
    user.coverPicture = req.body.coverPicture;
    await user.save();
    res.status(200).json({ message: "updateProfileDone", user: user });
  } catch (error) {
    res.status(500).json({ message: error.message || "updateCoverFile" });
  }
};
exports.getUserUpdate = async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  try {
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.ChangePasswordEmail = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    const hashPassword = await bcrypt.hash(req.body.newpassword, 12);
    user.password = hashPassword;
    await user.save();
    res.status(200).json({ message: "resetPasswordDone" });
  } catch (error) {
    res.status(200).json({ error: error });
  }
};
exports.ChangePassword = async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  const oldPassword = req.body.oldPassword;
  const newPasword = req.body.password;
  const confirm = await bcrypt.compare(oldPassword, user.password);
  if (confirm) {
    try {
      const hashPassword = await bcrypt.hash(newPasword, 12);
      user.password = hashPassword;
      await user.save();
      res.status(200).json({ message: "Change Password Done" });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: "OldPassword Is Wrong" });
  }
};
