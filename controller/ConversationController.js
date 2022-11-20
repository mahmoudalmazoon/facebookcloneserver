const Conversation = require("../models/Conversation");
exports.newConversation = (req, res, next) => {
  Conversation.find({
    members: { $in: [req.body.receiverId] },
  })
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json({
          message: "conversationcreatebefore",
          savedConversation: data,
        });
      } else {
        const newConversation = new Conversation({
          members: [req.body.senderId, req.body.receiverId],
        });
        const savedConversation = newConversation.save();
        res.status(200).json({
          message: "done",
          savedConversation: savedConversation,
        });
      }
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
};
exports.getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res
      .status(200)
      .json({ message: "fetchConversationDone", conversation: conversation });
  } catch (error) {
    res.status(404).json({ error: error });
  }
};
exports.getConversationExact = async (req, res, next) => {
  try {
    const converation = await Conversation.findById(req.params.converationId);
    res
      .status(200)
      .json({ message: "fetchConversationDone", converation: converation });
  } catch (error) {
    res.status(404).json({ error: error });
  }
};
