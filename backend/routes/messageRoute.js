const express = require("express");
const messageRouter = express.Router();
const {
  addMessage,
  getMessages,
  deleteMessage,
} = require("../controllers/messageController"); // Import the controller methods
const verifyToken = require("../middlewire/verifyToken");

// Route to add a new message
messageRouter.post("/message", verifyToken, addMessage);

// Route to fetch messages for a specific user
messageRouter.get("/messages", getMessages);

messageRouter.delete("/messages/delete/:id", deleteMessage);

module.exports = messageRouter;
