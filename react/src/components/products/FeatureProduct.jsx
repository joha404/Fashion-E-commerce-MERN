import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./FeatureProduct.css";

export default function FeatureProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://api.escuelajs.co/api/v1/products")
      .then((response) => {
        setProducts(response.data.slice(0, 10)); // Limiting to 10 products
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section id="featured-products" className="product-store padding-large">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between">
          <h2 className="section-title">Featured Products</h2>
          <div className="btn-wrap">
            <a href="shop.html" className="d-flex align-items-center">
              View all products <i className="icon icon-arrow-io"></i>
            </a>
          </div>
        </div>

        {/* Swiper Component */}
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={20}
          slidesPerView={4}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          loop={true}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide className="container" key={product.id}>
              <div className="product-item">
                <div className="image-holder">
                  <img
                    src={product.images?.[0] || "/images/default.jpg"}
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
                      Add to cart <i className="icon icon-arrow-io"></i>
                    </button>
                    <button type="button" className="view-btn tooltip d-flex">
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
                    <a href={`single-product.html?id=${product.id}`}>
                      {product.title}
                    </a>
                  </h3>
                  <span className="item-price text-primary">
                    ${product.price}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
