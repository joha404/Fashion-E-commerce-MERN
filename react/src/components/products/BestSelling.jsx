import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

export default function BestSelling() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  ); // Manage wishlist state

  const navigate = useNavigate(); // Initialize the navigate function

  // Retrieve products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/product/all");
        if (response.data.length > 0) {
          setProducts(response.data);
        } else {
          console.warn("No products found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId, price) => {
    setCartLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/cart/add",
        { productId, quantity: 1, price },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        title: "Added to Cart",
        icon: "success",
        draggable: true,
      });
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response?.data || error.message
      );

      Swal.fire({
        title: "Please Log In",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Log In",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddToWishlist = (productId) => {
    setWishlistLoading(true);

    let updatedWishlist = [...wishlist];

    if (updatedWishlist.includes(productId)) {
      // Remove from wishlist
      updatedWishlist = updatedWishlist.filter((id) => id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

      Swal.fire({
        title: "Removed from Wishlist",
        icon: "success",
        draggable: true,
      });
    } else {
      // Add to wishlist
      updatedWishlist.push(productId);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

      Swal.fire({
        title: "Added to Wishlist",
        icon: "success",
        draggable: true,
      });
    }

    setWishlist(updatedWishlist); // Update the wishlist state
    setWishlistLoading(false);
  };

  const isProductInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  return (
    <section
      id="selling-products"
      className="product-store bg-light-grey padding-large"
    >
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Best Selling Products</h2>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="tab-content">
            <div id="all" data-tab-content className="active">
              <div className="row d-flex flex-wrap">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="product-item col-lg-3 col-md-6 col-sm-6 "
                  >
                    <div className="image-holder">
                      <Link to={`/product/${product._id}`}>
                        <img
                          src={
                            product.image
                              ? `http://localhost:3000/${product.image}`
                              : "/default-image.jpg"
                          }
                          alt={product.name}
                          className="product-image"
                        />
                      </Link>
                    </div>
                    <div className="cart-concern">
                      <div className="cart-button d-flex justify-content-between align-items-center">
                        <button
                          type="button"
                          className="btn-wrap cart-link d-flex align-items-center"
                          onClick={() =>
                            handleAddToCart(product._id, product.price)
                          }
                          disabled={cartLoading}
                        >
                          {cartLoading ? "Adding..." : "Add to Cart"}{" "}
                          <i className="icon icon-arrow-io"></i>
                        </button>

                        <button
                          type="button"
                          className="btn-wrap cart-link d-flex align-items-center"
                          onClick={() => handleAddToWishlist(product._id)}
                          disabled={wishlistLoading}
                        >
                          {isProductInWishlist(product._id) ? (
                            <i className="fa fa-solid fa-heart"></i> // Filled heart icon if in wishlist
                          ) : (
                            <i className="icon icon-heart"></i> // Empty heart icon if not in wishlist
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="product-detail">
                      <h3 className="product-title">
                        <a href={`/product/${product._id}`}>{product.name}</a>
                      </h3>
                      <div className="item-price text-primary">
                        ${product.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
