import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SingleProduct.css"; // Import custom styles
import BestSelling from "./BestSelling";

export default function SingleProduct() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const [addedToCart, setAddedToCart] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const magnifierRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:3000/product/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product not found");
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  // Function for magnifier effect, zoom only on left and right sides
  const handleMouseMove = (e) => {
    if (!magnifierRef.current || !product) return;

    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    // Apply zoom effect only if mouse is on the left or right side of the image
    if (e.clientX < left + width * 0.25 || e.clientX > left + width * 0.75) {
      magnifierRef.current.style.display = "block";
      magnifierRef.current.style.left = `${e.clientX - 100}px`;
      magnifierRef.current.style.top = `${e.clientY - 100}px`;
      magnifierRef.current.children[0].style.left = `-${x * 6}%`;
      magnifierRef.current.children[0].style.top = `-${y * 6}%`;
    } else {
      magnifierRef.current.style.display = "none"; // Hide magnifier if mouse is in the center
    }
  };

  const handleMouseLeave = () => {
    if (magnifierRef.current) magnifierRef.current.style.display = "none";
  };

  const handleAddToCart = async () => {
    setCartLoading(true);
    try {
      await axios.post(
        "http://localhost:3000/cart/add",
        { productId: product._id, quantity, price: product.price },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      Swal.fire({ title: "Added to Cart", icon: "success", draggable: true });
      setAddedToCart(true);
    } catch (error) {
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

  const handleAddToWishlist = () => {
    setWishlistLoading(true);
    let updatedWishlist = [...wishlist];
    if (updatedWishlist.includes(product.id)) {
      updatedWishlist = updatedWishlist.filter((id) => id !== product.id);
      Swal.fire({ title: "Removed from Wishlist", icon: "success" });
    } else {
      updatedWishlist.push(product.id);
      Swal.fire({ title: "Added to Wishlist", icon: "success" });
    }
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
    setWishlistLoading(false);
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;
  if (!product) return <p className="text-center mt-5">No product found.</p>;

  return (
    <>
      <div className="container py-5">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-6 my-2 text-center">
            <div
              className="product-img-wrapper shadow rounded"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={`http://localhost:3000/${product.image.replace(
                  "\\",
                  "/"
                )}`}
                alt={product.name}
                className="img-fluid product-img"
              />
              <div className="product-img-magnifier" ref={magnifierRef}>
                <img
                  src={`http://localhost:3000/${product.image.replace(
                    "\\",
                    "/"
                  )}`}
                  alt="Zoomed"
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6 my-2">
            <div className="product-details shadow-lg rounded p-4">
              <h1 className="fw-bold text-center pt-3">{product.name}</h1>
              <p className="text-muted text-center">{product.discription}</p>
              <p className="price-tag text-center">Price: ${product.price}</p>

              <div className="quantity-input mb-4">
                <label className="form-label fw-bold">Quantity:</label>
                <div className="input-group quantity-control">
                  <button
                    className="btn btn-outline-secondary quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <i class=" fa fa-solid fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    className="form-control text-center quantity-input-field"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    min="1"
                  />
                  <button
                    className="btn btn-outline-secondary quantity-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <i class="fa fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>

              <div className="wishlist mb-4">
                <button
                  className={`btn ${
                    wishlist.includes(product.id)
                      ? "btn-danger"
                      : "btn-outline-danger"
                  } w-100`}
                  onClick={handleAddToWishlist}
                  disabled={wishlistLoading}
                >
                  {wishlist.includes(product.id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </button>
              </div>

              <button
                className="btn btn-primary w-100 add-to-cart"
                onClick={handleAddToCart}
                disabled={cartLoading || addedToCart}
              >
                {addedToCart
                  ? "Added to Cart"
                  : cartLoading
                  ? "Adding..."
                  : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <BestSelling />
    </>
  );
}
