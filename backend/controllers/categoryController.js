const categorySchema = require("../models/categorySchema");

async function createCategory(req, res) {
  let { name, discription } = req.body;

  try {
    const findCategory = await categorySchema.findOne({ name });
    if (findCategory) {
      return res.status(400).send("Category Already Exists");
    }
    const create = await categorySchema.create({
      name,
      discription,
    });
    res.status(200).send(create);
  } catch (error) {
    res.status(500).json(error.message);
  }
}
async function allCategory(req, res) {
  const findCategory = await categorySchema.find();
  res.status(200).json(findCategory);
}

async function updateCategory(req, res) {
  const { id } = req.params; // Get product ID from URL
  const updateData = req.body; // Get updated product data

  try {
    const updatedCategory = await categorySchema.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updateCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      product: updateCategory,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error updating Category", error: err.message });
  }
}

// Delete Product
async function deleteCategory(req, res) {
  const { id } = req.params;

  try {
    const removeCategory = await categorySchema.findByIdAndDelete(id);

    if (!removeCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error deleting product", error: err.message });
  }
}

module.exports = {
  createCategory,
  allCategory,
  updateCategory,
  deleteCategory,
};
