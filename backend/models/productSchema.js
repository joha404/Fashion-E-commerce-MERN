const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  discription: { type: String, required: true },
  oldPrice: String,
  stock: Boolean,
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
