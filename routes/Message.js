const router = require("express").Router()
const MessageController = require("../controller/MessageController")
router.post("/:conversationId",MessageController.SendMessage)
router.post("/seen/:conversationId",MessageController.getMessages)
router.get("/unSeen/:userId",MessageController.getMessageNotShow)
module.exports = router