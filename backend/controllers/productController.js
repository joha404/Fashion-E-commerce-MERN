const Product = require("../models/productSchema");

// Create a new product
async function createProduct(req, res) {
  try {
    let { name, discription, price } = req.body; // Fixed typo in discription
    const image = req.file ? req.file.path : null; // Handle image upload

    // Validate fields
    if (!name || !discription || !price) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // Ensure price is a valid number
    if (isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a valid positive number" });
    }

    // Create the new product
    const newProduct = await Product.create({
      name,
      discription, // Fixed typo here too
      price,
      image,
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
}

// Get all products
async function allProducts(req, res) {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
}

// Get a single product by ID
async function singleProduct(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product retrieved successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving product", error: error.message });
  }
}

// Update a product
async function updateProduct(req, res) {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Check if an image was uploaded
    if (req.file) {
      updateData.image = req.file.path; // Update image path
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
}

// Delete a product
async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
}

module.exports = {
  createProduct,
  allProducts,
  singleProduct,
  updateProduct,
  deleteProduct,
};
