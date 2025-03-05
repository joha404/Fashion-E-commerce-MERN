const Cart = require("../models/cartSchema");
const Product = require("../models/productSchema");

// Add Item to Cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;
    const userId = req.userId;
    console.log(userId);

    if (!userId) return res.status(400).json({ message: "User ID is missing" });
    if (!productId)
      return res.status(400).json({ message: "Product ID is required" });
    if (!quantity || quantity <= 0)
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    if (!price || price < 0)
      return res.status(400).json({ message: "Price must be valid" });

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, price }],
        totalPrice: quantity * price,
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, price });
      }
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      );
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get User's Cart
async function getCart(req, res) {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart retrieved successfully", cart });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error retrieving cart", error: err.message });
  }
}

// Remove Item from Cart
async function removeFromCart(req, res) {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => !item.productId.equals(productId));
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error removing item from cart", error: err.message });
  }
}
async function updateCartQuantity(req, res) {
  const { userId, productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) =>
      item.productId.equals(productId)
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Update the quantity of the item
    cart.items[itemIndex].quantity = quantity;

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error updating cart", error: err.message });
  }
}

// Clear Cart
async function clearCart(req, res) {
  const { userId } = req.params;

  try {
    await Cart.findOneAndDelete({ userId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error clearing cart", error: err.message });
  }
}

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartQuantity,
};
