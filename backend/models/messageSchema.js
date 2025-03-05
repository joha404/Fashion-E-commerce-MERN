const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    name: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    email: {
      type: String,
      required: true, // Make email required
    },
    messages: {
      type: [String], // Array of strings for multiple messages
      required: true, // You can choose if this should be required or not
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model("message", messageSchema);
