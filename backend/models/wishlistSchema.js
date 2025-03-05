const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Assuming you're using a User schema
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product", // Assuming you're using a Product schema
        required: true,
      },
    },
  ],
});

const Wishlist = mongoose.model("wishlist", wishlistSchema);
module.exports = Wishlist;
