const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false }, // Marks primary address
  createdAt: { type: Date, default: Date.now },
});

const Address = mongoose.model("address", addressSchema);

module.exports = Address;
