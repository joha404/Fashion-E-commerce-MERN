const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");

// Create a new product
async function createProduct(req, res) {
  try {
    let { name, discription, price, oldPrice, stock, categoryName } = req.body; // Include all fields
    const image = req.file ? req.file.path : null; // Handle image upload

    if (!name || !discription || !price || !categoryName) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    if (isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a valid positive number" });
    }

    // Find the category by name
    let category = await Category.findOne({ name: categoryName });

    // If category does not exist, create it
    if (!category) {
      category = await Category.create({ name: categoryName });
    }

    // Create the new product with the category ID
    const newProduct = await Product.create({
      name,
      discription,
      price,
      oldPrice: oldPrice || "", // Default to empty string if not provided
      stock: stock || false, // Default to false if not provided
      image,
      category: category._id, // Store ObjectId reference
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
}

// Get all products with category names
async function allProducts(req, res) {
  try {
    const products = await Product.find().populate("category", "name"); // Populate category
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
    const product = await Product.findById(id).populate("category", "name"); // Populate category
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

    // If category name is provided, find or create the category and update category ID
    if (updateData.categoryName) {
      let category = await Category.findOne({ name: updateData.categoryName });

      if (!category) {
        category = await Category.create({ name: updateData.categoryName });
      }

      updateData.category = category._id;
      delete updateData.categoryName; // Remove categoryName to avoid conflicts
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("category", "name"); // Populate category

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
