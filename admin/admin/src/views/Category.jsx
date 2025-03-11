import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addFormData, setAddFormData] = useState({
    name: "",
    discription: "",
    _id: null, // Store ID for editing
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/category/allcategory"
      );
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      setLoading(false);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditClick = (category) => {
    setAddFormData({
      name: category.name,
      discription: category.discription,
      _id: category._id,
    });

    const modal = new bootstrap.Modal(
      document.getElementById("addCategoryModel")
    );
    modal.show();
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (addFormData._id) {
        // Update existing category
        response = await axios.put(
          `http://localhost:3000/category/update/${addFormData._id}`,
          { name: addFormData.name, discription: addFormData.discription }
        );
        if (response.data && response.data.category) {
          setCategories((prev) =>
            prev.map((category) =>
              category._id === addFormData._id
                ? response.data.category
                : category
            )
          );
        }
      } else {
        // Create new category
        response = await axios.post("http://localhost:3000/category/create", {
          name: addFormData.name,
          discription: addFormData.discription,
        });

        // Ensure response contains new category
        if (response.data && response.data.category) {
          setCategories((prev) => [...prev, response.data.category]); // ✅ Update state
        } else {
          console.error("Unexpected API response:", response.data);
        }
      }

      Swal.fire("Category Saved Successfully!", "", "success");

      // Reset form state
      setAddFormData({ name: "", discription: "", _id: null });

      // Close modal safely
      const modalElement = document.getElementById("addCategoryModel");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();
    } catch (error) {
      console.error("Error saving category:", error);
      Swal.fire("Error", "There was an error saving the category.", "error");
    }
  };

  const handleDeleteClick = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:3000/category/delete/${categoryId}`);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== categoryId)
      );
      Swal.fire("Category Deleted Successfully!", "", "success");
    } catch (error) {
      console.error("Error deleting category:", error.message);
      Swal.fire("Error", "There was an error deleting the category.", "error");
    }
  };

  return (
    <div className="container pt-4 px-4">
      <div className="bg-light text-center rounded p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h6 className="mb-0">All Categories</h6>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addCategoryModel"
          >
            Add Category
          </button>
        </div>

        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <div className="table-responsive">
            <table className="table text-center align-middle table-bordered table-hover mb-0">
              <thead>
                <tr className="text-dark">
                  <th scope="col">Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category._id}>
                      <td>{category.name}</td>
                      <td>{category.discription}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning mx-1"
                          onClick={() => handleEditClick(category)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger mx-1"
                          onClick={() => handleDeleteClick(category._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No categories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      <div
        className="modal fade"
        id="addCategoryModel"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {addFormData._id ? "Edit Category" : "Add Category"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddSubmit}>
                <div className="mb-3">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={addFormData.name}
                    onChange={handleAddChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="discription"
                    className="form-control"
                    value={addFormData.discription}
                    onChange={handleAddChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success">
                  {addFormData._id ? "Update Category" : "Add Category"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
