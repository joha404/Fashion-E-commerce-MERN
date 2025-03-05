const express = require("express");
const {
  createCategory,
  allCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const categoryoruter = express.Router();

categoryoruter.post("/create", createCategory);
categoryoruter.get("/allcategory", allCategory);
categoryoruter.post("/update/:id", updateCategory);
categoryoruter.post("/delete/:id", deleteCategory);

module.exports = categoryoruter;
