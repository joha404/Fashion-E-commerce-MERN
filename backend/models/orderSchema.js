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
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
