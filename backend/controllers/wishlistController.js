const Wishlist = require("../models/wishlistSchema");
const Product = require("../models/productSchema");

// Add item to wishlist
// Function to add product to wishlist in localStorage
const addToWishlist = (productId) => {
  // Check if we are in a browser environment where localStorage is available
  if (typeof window !== "undefined" && window.localStorage) {
    // Retrieve current wishlist from localStorage (or initialize as an empty array)
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    console.log(wishlist);

    // Check if the product is already in the wishlist
    if (!wishlist.includes(productId)) {
      // Add productId to wishlist
      wishlist.push(productId);

      // Save updated wishlist to localStorage
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } else {
      console.log("Product is already in wishlist");
    }
  } else {
    console.warn("localStorage is not available.");
  }
};

// Get all items in the wishlist
async function getWishlist(req, res) {
  const userId = req.cookies.userId; // Access userId from cookies

  if (!userId) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    const wishlist = await Wishlist.findOne({ userId }).populate(
      "items.productId"
    );
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res
      .status(200)
      .json({ message: "Wishlist retrieved successfully", wishlist });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error retrieving wishlist", error: err.message });
  }
}
// Get a single item in the wishlist
async function getSingleWishlistItem(req, res) {
  const { productId } = req.params; // Get productId from the request parameters
  const userId = req.userId; // Access userId from cookies

  if (!userId) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    // Find the wishlist and check if the product is in the wishlist
    const wishlist = await Wishlist.findOne({
      userId,
      "items.productId": productId,
    }).populate("items.productId"); // Populate product details for the item

    if (!wishlist) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    // Find the specific item in the wishlist
    const item = wishlist.items.find(
      (item) => item.productId._id.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    res.status(200).json({ message: "Product found in wishlist", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error retrieving product from wishlist",
      error: err.message,
    });
  }
}

// Remove item from wishlist
async function removeFromWishlist(req, res) {
  const { productId } = req.body;
  const userId = req.cookies.userId; // Access userId from cookies

  if (!userId) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(
      (item) => !item.productId.equals(productId)
    );

    await wishlist.save();
    res.status(200).json({ message: "Item removed from wishlist", wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error removing item from wishlist",
      error: err.message,
    });
  }
}

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  getSingleWishlistItem,
};
