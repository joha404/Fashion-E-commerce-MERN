import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NewArrival() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://api.escuelajs.co/api/v1/products"
        );
        setProducts(response.data.slice(22, 26)); // Get first 8 products
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section
      id="selling-products"
      className="product-store bg-light-grey padding-large"
    >
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">New Arrivals</h2>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="tab-content">
            <div id="all" data-tab-content className="active">
              <div className="row d-flex flex-wrap">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="product-item col-lg-3 col-md-6 col-sm-6"
                  >
                    <div className="image-holder">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="product-image"
                      />
                    </div>
                    <div className="cart-concern">
                      <div className="cart-button d-flex justify-content-between align-items-center">
                        <button
                          type="button"
                          className="btn-wrap cart-link d-flex align-items-center"
                        >
                          Add to Cart <i className="icon icon-arrow-io"></i>
                        </button>
                        <button
                          type="button"
                          className="view-btn tooltip d-flex"
                        >
                          <i className="icon icon-screen-full"></i>
                          <span className="tooltip-text">Quick view</span>
                        </button>
                        <button type="button" className="wishlist-btn">
                          <i className="icon icon-heart"></i>
                        </button>
                      </div>
                    </div>
                    <div className="product-detail">
                      <h3 className="product-title">
                        <a href={`/product/${product.id}`}>{product.title}</a>
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
