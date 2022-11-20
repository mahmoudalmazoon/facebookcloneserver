const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
exports.SendMessage = async (req, res, next) => {
  const newMessage = new Message({
    conversationId: req.params.conversationId,
    sender: req.body.senderId,
    text: req.body.text,
    profilePicture: req.body.profilePicture,
  });
  const saveMessage = await newMessage.save();
  try {
    res
      .status(200)
      .json({ message: "sendMessageDone", saveMessage: saveMessage });
  } catch (error) {
    res.status(404).json({ error: error });
  }
};
exports.getMessages = async (req, res, next) => {
  const Messages = await Message.find({
    conversationId: req.params.conversationId,
  });
  const MessagesSeen = await Message.find({
    conversationId: req.params.conversationId,
    sender: { $not: { $eq: req.body.UserRequestId } },
  });
  MessagesSeen.map((Message) => {
    Message.isShow = true;
    return Message.save();
  });
  try {
    res
      .status(200)
      .json({ message: "fetchCoversationDone", Messages: Messages });
  } catch (error) {
    res.status(404).json({ error: error });
  }
};
exports.getMessageNotShow = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    const AllUnShowMessage = await Promise.all(
      conversations.map((conversation) => {
        return Message.find({
          conversationId: conversation._id,
        });
      })
    );

    const unSeen = AllUnShowMessage[0]?.filter((m) => {
      return m.isShow === false 
    });
    const unSenderUnSeen = unSeen.filter((m) => {
      return m.sender !== req.params.userId 
    });
    res.status(200).json({ message: "Fetch UnSeen Done", unSeen: unSenderUnSeen });
  } catch (error) {
    res.status(404).json({ error: error });
  }
};
