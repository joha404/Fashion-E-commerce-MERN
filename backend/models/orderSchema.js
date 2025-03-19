const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      name: { type: String, required: true },
      email: { type: String },
      phone: { type: String },
      address: { type: String },
      postCode: { type: String },
    },
    userInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Change 'user' to 'User'
    },
    cart: [
      {
        product: { type: String },
        quantity: { type: Number },
        price: { type: Number },
        total: { type: Number },
      },
    ],
    totalAmount: { type: Number, required: true },
    tranjectionId: { type: String, required: true },
    paidStatus: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema); // Ensure the model name is 'Order' here as well
