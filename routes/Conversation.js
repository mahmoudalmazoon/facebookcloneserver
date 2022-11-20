const router = require("express").Router();
const ConversationController = require("../controller/ConversationController");
router.post("/", ConversationController.newConversation);
router.get("/:userId", ConversationController.getConversation);
router.get("/exact/:converationId", ConversationController.getConversationExact);

module.exports = router