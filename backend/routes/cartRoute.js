const express = require("express");
const cartRouter = express.Router();
const verifyToken = require("../middlewire/verifyToken");
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartQuantity,
} = require("../controllers/cartController");

//  Add item to cart
cartRouter.post("/add", verifyToken, addToCart);

//  Get user's cart
cartRouter.get("/:userId", getCart);

//  Remove item from cart
cartRouter.post("/remove", removeFromCart);

//  Clear the entire cart
cartRouter.delete("/clear/:userId", clearCart);

cartRouter.post("/update", updateCartQuantity);

module.exports = cartRouter;
