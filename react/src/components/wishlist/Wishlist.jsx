import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to get wishlist items from localStorage
  const getWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist"));
    return Array.isArray(wishlist) ? wishlist : [];
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const wishlistItems = getWishlist();
      if (!wishlistItems || wishlistItems.length === 0) {
        console.log("No items in wishlist.", wishlistItems.length);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section
      id="wishlist-products"
      className="product-store bg-light-grey padding-large"
    >
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">My Wishlist</h2>
        </div>

        {loading ? (
          <p>Loading wishlist products...</p>
        ) : products.length === 0 ? (
          <p>No products in wishlist.</p>
        ) : (
          <div className="tab-content">
            <div id="all" data-tab-content className="active">
              <div className="row d-flex flex-wrap">
                {products.map((product, index) => (
                  <div
                    key={product.id || index}
                    className="product-item col-lg-3 col-md-6 col-sm-6"
                  >
                    <div className="image-holder">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.image[0]}
                          alt={product.name || "No Title"}
                          className="product-image"
                        />
                      ) : (
                        <p>No Image Available</p>
                      )}
                    </div>
                    <div className="product-detail">
                      <h3 className="product-title">
                        <a href={`/product/${product._id || "#"}`}>
                          {product.title || "No Title"}
                        </a>
                      </h3>
                      <div className="item-price text-primary">
                        ${product.price || "N/A"}
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
