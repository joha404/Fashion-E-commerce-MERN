import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Product.css";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discription: "",
    image: null,
  });

  const [addFormData, setAddFormData] = useState({
    name: "",
    price: "",
    discription: "",
    image: null,
  });

  useEffect(() => {
    fetchProducts();
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

  // Open the update modal
  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      discription: product.discription,
      image: null, // Reset image when opening update modal
    });
    setModalVisible(true);
  };

  // Handle file change for update modal
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle input change for update modal
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit updated product
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const updatedProductData = new FormData();
    updatedProductData.append("name", formData.name);
    updatedProductData.append("price", formData.price);
    updatedProductData.append("discription", formData.discription);

    if (formData.image) {
      updatedProductData.append("image", formData.image);
    }

    console.log("Submitting updated data:", updatedProductData);

    try {
      const response = await axios.put(
        `http://localhost:3000/product/update/${selectedProduct._id}`,
        updatedProductData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      Swal.fire({
        title: "Product Updated Successfully!",
        icon: "success",
        draggable: true,
      }).then(() => {
        // Reload the products or refresh the page after the SweetAlert is closed
        fetchProducts(); // Fetch updated list of products
        setModalVisible(false); // Close the modal
      });
    } catch (error) {
      console.error(
        "Error updating product:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Handle file change for add modal
  const handleAddFileChange = (e) => {
    setAddFormData({ ...addFormData, image: e.target.files[0] });
  };

  // Handle input change for add modal
  const handleAddChange = (e) => {
    setAddFormData({ ...addFormData, [e.target.name]: e.target.value });
  };

  // Submit new product
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const newProductData = new FormData();
    newProductData.append("name", addFormData.name);
    newProductData.append("price", addFormData.price);
    newProductData.append("discription", addFormData.discription);

    if (addFormData.image) {
      newProductData.append("image", addFormData.image);
    }

    console.log("Submitting new data:", newProductData);

    try {
      const response = await axios.post(
        "http://localhost:3000/product/create",
        newProductData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Server Response:", response.data);
      setProducts([...products, response.data.product]); // Update list immediately
      setAddModalVisible(false);
      Swal.fire({
        title: "Product Added Successfully!",
        icon: "success",
        draggable: true,
      });
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
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
        <div className="productDetailsInAdmin">
          <h6 className="mb-4">Our All Products</h6>
          <button
            className="btn btn-success mb-3"
            id="AddNewProductButton"
            onClick={() => setAddModalVisible(true)}
          >
            Add New
          </button>
        </div>
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
                  <th>Discription</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="productDetailsTbody">
                {products.length > 0 ? (
                  products.reverse().map((product) => (
                    <tr key={product.id}>
                      <td className="">
                        <div className="productNameAdmin">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <img
                          src={
                            product.image
                              ? `http://localhost:3000/${product.image}`
                              : "https://via.placeholder.com/50"
                          }
                          alt={product.name}
                          width="100"
                          height="100"
                        />
                      </td>
                      <td className="">
                        <div className="productNameAdmin">{product.name}</div>
                      </td>
                      <td>
                        <div className="productNameAdmin">
                          ${product.price.toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <div className="productNameAdmin">
                          {product.discription}
                        </div>
                      </td>
                      <td className="d-flex">
                        <div className="productNameAdmin">
                          <button
                            className="btn btn-sm mx-1"
                            id="product_button"
                            onClick={() => openUpdateModal(product)}
                          >
                            <i
                              id="updateIcon"
                              class="fa-solid fa-pen-to-square"
                            ></i>
                          </button>
                          <button
                            className="btn btn-sm mx-1"
                            id="product_button"
                            onClick={() => deleteProduct(product._id)}
                          >
                            <i class="fa-solid fa-trash"></i>
                          </button>
                        </div>
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
      {addModalVisible && (
        <div
          className="modal show "
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content ModalContent">
              <div className="modal-header">
                <h5 className="modal-title text-center">Add New Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setAddModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddSubmit} encType="multipart/form-data">
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
                  <div className="mb-3">
                    <label className="form-label">Discription</label>
                    <input
                      type="text"
                      className="form-control"
                      name="discription"
                      value={addFormData.discription}
                      onChange={handleAddChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      onChange={handleAddFileChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Add Product
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Product Modal */}
      {modalVisible && selectedProduct && (
        <div
          className="modal show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content ModalContent">
              <div className="modal-header">
                <h5 className="modal-title">Update Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={handleUpdateSubmit} // Use the form's submit handler
                  encType="multipart/form-data"
                >
                  <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Discription</label>
                    <input
                      type="text"
                      className="form-control"
                      name="discription"
                      value={formData.discription}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      onChange={handleFileChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update Product
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
