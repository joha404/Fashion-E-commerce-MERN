const express = require("express");
const router = express.Router();
const { addMessage, getMessages } = require("../controllers/messageController"); // Import the controller methods
const verifyToken = require("../middlewire/verifyToken");

// Route to add a new message
router.post("/message", verifyToken, addMessage);

// Route to fetch messages for a specific user
router.get("/messages", getMessages);

module.exports = router;
