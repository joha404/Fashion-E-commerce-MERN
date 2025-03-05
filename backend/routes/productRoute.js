const express = require("express");
const upload = require("../middlewire/upload"); // Import Multer for image uploads
const {
  createProduct,
  allProducts,
  updateProduct,
  deleteProduct,
  singleProduct,
} = require("../controllers/productController");

const productRouter = express.Router();

// Create a product (with image upload)
productRouter.post("/create", upload.single("image"), createProduct);

// Get all products
productRouter.get("/all", allProducts);

// Get a single product by ID
productRouter.get("/:id", singleProduct);

// Update a product (with optional image upload)
productRouter.put("/update/:id", upload.single("image"), updateProduct);

// Delete a product
productRouter.delete("/delete/:id", deleteProduct);

module.exports = productRouter;
