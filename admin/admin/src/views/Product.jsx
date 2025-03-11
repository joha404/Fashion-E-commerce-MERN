import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Product.css";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [addFormData, setAddFormData] = useState({
    name: "",
    price: "",
    discription: "",
    oldPrice: "",
    stock: "",
    categoryName: "",
    image: null,
    _id: null, // Added _id to handle update functionality
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/product/all");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/category/allcategory"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const handleAddFileChange = (e) => {
    setAddFormData({ ...addFormData, image: e.target.files[0] });
  };
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prevState) => ({
      ...prevState,
      [name]: name === "stock" ? value === "true" : value, // Handle stock as boolean
    }));
  };

  const handleEditClick = (product) => {
    setAddFormData({
      name: product.name,
      price: product.price,
      discription: product.discription,
      oldPrice: product.oldPrice || "",
      stock: product.stock ? "true" : "false",
      categoryName: product.categoryName,
      image: null, // Do not set image as it'll be uploaded again
      _id: product._id, // Set the _id for the update operation
    });

    // Open the modal
    const modal = new bootstrap.Modal(
      document.getElementById("addProductModal")
    );
    modal.show();
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // Validate categoryName before submitting
    if (!addFormData.categoryName) {
      Swal.fire("Error", "Please select a category.", "error");
      return;
    }

    const newProductData = new FormData();
    newProductData.append("name", addFormData.name);
    newProductData.append("price", addFormData.price);
    newProductData.append("oldPrice", addFormData.oldPrice);
    newProductData.append("stock", addFormData.stock);
    newProductData.append("categoryName", addFormData.categoryName);
    newProductData.append("discription", addFormData.discription);

    if (addFormData.image) {
      newProductData.append("image", addFormData.image);
    }

    try {
      let response;
      if (addFormData._id) {
        // Update existing product
        response = await axios.put(
          `http://localhost:3000/product/update/${addFormData._id}`,
          newProductData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const updatedProducts = products.map((product) =>
          product._id === addFormData._id ? response.data.product : product
        );
        setProducts(updatedProducts);
      } else {
        // Create new product
        response = await axios.post(
          "http://localhost:3000/product/create",
          newProductData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setProducts([...products, response.data.product]);
      }

      if (response.data && response.data.product) {
        Swal.fire("Product Saved Successfully!", "", "success");

        // Reset form
        setAddFormData({
          name: "",
          price: "",
          discription: "",
          oldPrice: "",
          stock: "",
          categoryName: "",
          image: null,
          _id: null,
        });

        // Close modal
        const closeModalButton = document.querySelector(
          "#addProductModal .btn-close"
        );
        closeModalButton.click();
      } else {
        Swal.fire("Error", "Failed to save product.", "error");
      }
    } catch (error) {
      console.error("Error saving product:", error.message);
      Swal.fire("Error", "There was an error saving the product.", "error");
    }
  };

  const handleDeleteClick = async (productId) => {
    try {
      // Send the delete request to the server
      await axios.delete(`http://localhost:3000/product/delete/${productId}`);

      // Immediately update the product list state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );

      Swal.fire({
        title: "Product Deleted Successfully!",
        icon: "success",
        draggable: true,
      });
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response ? error.response.data : error.message
      );
      Swal.fire({
        title: "Error deleting product!",
        icon: "error",
        draggable: true,
      });
    }
  };

  return (
    <div className="container pt-4 px-4">
      <div className="bg-light text-center rounded p-4">
        <h6 className="mb-4">Our Products</h6>

        {/* Add Product Button */}
        <button
          className="btn btn-success mb-3"
          data-bs-toggle="modal"
          data-bs-target="#addProductModal"
        >
          Add New Product
        </button>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="table-responsive mt-4">
            <table className="table text-center table-bordered table-hover">
              <thead>
                <tr className="text-dark">
                  <th>Date</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.reverse().map((product) => (
                    <tr key={product._id}>
                      <td>
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <img
                          src={
                            product.image
                              ? `http://localhost:3000/${product.image}`
                              : "https://via.placeholder.com/100"
                          }
                          alt={product.name}
                          width="100"
                          height="100"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>{product.discription}</td>
                      <td>
                        <button
                          className="btn btn-sm mx-1"
                          onClick={() => handleEditClick(product)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          className="btn btn-sm mx-1"
                          onClick={() => handleDeleteClick(product._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No products available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <div
        className="modal fade"
        id="addProductModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Product</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddSubmit}>
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={addFormData.name}
                    onChange={handleAddChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="discription"
                    value={addFormData.discription}
                    onChange={handleAddChange}
                    required
                  ></textarea>
                </div>

                {/* Old Price */}
                <div className="mb-3">
                  <label className="form-label">Old Price (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="oldPrice"
                    value={addFormData.oldPrice}
                    onChange={handleAddChange}
                  />
                </div>

                {/* Price */}
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={addFormData.price}
                    onChange={handleAddChange}
                    required
                  />
                </div>

                {/* Stock */}
                <div className="mb-3">
                  <label className="form-label">Stock Status</label>
                  <select
                    className="form-control"
                    name="stock"
                    value={addFormData.stock}
                    onChange={handleAddChange}
                    required
                  >
                    <option value="">Select Stock Status</option>
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>

                <select
                  className="form-control"
                  name="categoryName"
                  value={addFormData.categoryName}
                  onChange={handleAddChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Image Upload */}
                <div className="mb-3">
                  <label className="form-label">Product Image</label>
                  <input
                    type="file"
                    className="form-control"
                    name="image"
                    onChange={handleAddFileChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Save Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
