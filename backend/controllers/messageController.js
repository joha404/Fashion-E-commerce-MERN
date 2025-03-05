const Message = require("../models/messageSchema"); // Import the Message model
exports.addMessage = async (req, res) => {
  try {
    const userId = req.userId; // Assuming the user is authenticated
    const { name, email, messages } = req.body; // Extract data from the request body

    // Validate the messages field
    const messageArray = Array.isArray(messages) ? messages : [messages]; // Ensure it's an array

    // Check if there is a valid message
    if (
      !messageArray ||
      messageArray.length === 0 ||
      !messageArray[0]?.trim() // Ensure the message is not empty or just whitespace
    ) {
      return res.status(400).json({
        success: false,
        message: "Message is required and cannot be empty.",
      });
    }

    // Check if the user already has a message entry
    let userMessages = await Message.findOne({ userId });

    if (userMessages) {
      // If the user already has messages, push the new message to the existing array
      userMessages.messages.push(...messageArray); // Spread the messages into the existing array
      await userMessages.save();
      return res.status(200).json({
        success: true,
        message: "Message added successfully",
        data: userMessages,
      });
    } else {
      // If the user doesn't have a message entry, create a new one
      const newMessage = new Message({
        userId,
        name,
        email,
        messages: messageArray,
      });
      await newMessage.save();
      return res.status(201).json({
        success: true,
        message: "Message created successfully",
        data: newMessage,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the message",
      error: error.message,
    });
  }
};

// Fetch all messages for a user
exports.getMessages = async (req, res) => {
  try {
    const getAllMessage = await Message.find();
    res.send(getAllMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching messages",
      error: error.message,
    });
  }
};
