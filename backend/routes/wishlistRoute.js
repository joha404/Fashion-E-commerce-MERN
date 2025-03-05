const express = require("express");
const verifyToken = require("../middlewire/verifyToken");
const wishlistRouter = express.Router();
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  getSingleWishlistItem,
} = require("../controllers/wishlistController");

// Add item to wishlist
wishlistRouter.post("/add", verifyToken, addToWishlist);

// Get user's wishlist
wishlistRouter.get("/", getWishlist);

// Remove item from wishlist
wishlistRouter.delete("/remove", removeFromWishlist);
// wishlistRouter.get("/", getSingleWishlistItem);

module.exports = wishlistRouter;
