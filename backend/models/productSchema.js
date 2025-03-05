const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  discription: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Store image path
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
