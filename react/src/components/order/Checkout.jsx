import React, { useState, useRef, useEffect } from "react";
import "./Checkout.css";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { FaTrashAlt } from "react-icons/fa";

export default function Checkout() {
  // State to store form values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    postCode: "",
  });
  const [cart, setCart] = useState({ items: [] }); // ✅ Default empty array
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Fetch cart data and user token on component mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No authentication token found");
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(token);
        setDecodedToken(decodedToken);
        const userId = decodedToken.userId;
        if (!userId) {
          console.error("User ID not found in token");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/cart/${userId}`
        );
        console.log("Cart Response:", response.data);

        // ✅ Ensure cart is always set properly
        setCart(response.data.cart || { items: [] });
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCart({ items: [] }); // ✅ Avoid undefined cart
      } finally {
        setLoading(false);
      }
    };

    fetchCart();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check for mobile view
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Ref for the form
  const formRef = useRef(null);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle promo code change
  const handlePromoChange = (e) => {
    setPromoCode(e.target.value);
  };

  // Validate promo code
  const validatePromoCode = () => {
    if (promoCode === "hello" || promoCode === "joha") {
      setIsPromoValid(true);
      setDiscount(0.15); // 15% discount
    } else {
      setIsPromoValid(false);
      setDiscount(0); // No discount
    }
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the order details
    const orderDetails = {
      user: formData,
      cart: cart.items.map((item) => ({
        product: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
        total: (item.productId.price * item.quantity).toFixed(2),
      })),
      totalAmount: calculateTotal().toFixed(2),
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/checkout",
        orderDetails,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("response ", response);
      if (response?.data?.url) {
        window.location.href = response.data.url;
      } else {
        console.log("No URL returned from server");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Handle button click to submit form
  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit(); // Trigger form submission
    }
  };

  // Calculate total price from cart items
  const calculateTotal = () => {
    const total = cart.items.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
    return total - total * discount; // Apply discount if valid
  };

  return (
    <div className="checkout-container mt-5">
      <div className="checkout-row mx-4">
        {/* Billing Details */}
        <div className="billing-details">
          <div className="checkout-card">
            <div className="checkout-header billing-header">
              <h5>Billing Details</h5>
            </div>
            <div className="checkout-body">
              <form ref={formRef} onSubmit={handleSubmit}>
                {["name", "email", "phone", "address", "postCode"].map(
                  (field, index) => (
                    <div key={index} className="checkout-input-group">
                      <label className="mt-3">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        placeholder={`Enter your ${field}`}
                        value={formData[field]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary mx-3">
          <div className="checkout-card">
            <div className="checkout-header summary-header">
              <h5>Order Summary</h5>
            </div>
            <div className="checkout-body mt-4">
              <ul className="summary-list">
                {cart?.items?.length > 0 ? (
                  <>
                    {cart.items.map((item, index) => (
                      <React.Fragment key={index}>
                        <li className="summary-item">
                          <strong>Product:</strong> {item.productId.name}
                        </li>
                        <li className="summary-item">
                          <strong>Quantity:</strong> {item.quantity}
                        </li>
                        <li className="summary-item">
                          <strong>Price:</strong> $
                          {item.productId.price.toFixed(2)}
                        </li>
                        <li className="divider"></li>{" "}
                        {/* Optional divider for spacing */}
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <li>No items in the cart</li>
                )}

                {/* Shipping Row */}
                <li className="summary-item">
                  <strong>Shipping:</strong> Free
                </li>

                {/* Total Price Row */}
                <li className="summary-item total">
                  <strong>Total:</strong> ${calculateTotal().toFixed(2)}
                </li>
              </ul>

              <form
                className="promo-form card p-3 mt-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  validatePromoCode();
                }}
              >
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control promo-input"
                    placeholder="Enter Promo Code"
                    value={promoCode}
                    onChange={handlePromoChange}
                  />
                  <div className="input-group-append">
                    <button type="submit" className="btn btn-primary promo-btn">
                      Redeem
                    </button>
                  </div>
                </div>

                {isPromoValid && (
                  <p className="text-success mt-2" style={{ fontSize: "14px" }}>
                    Promo code applied! You got 15% off.
                  </p>
                )}
                {!isPromoValid && promoCode && (
                  <p className="text-danger mt-2" style={{ fontSize: "14px" }}>
                    Invalid promo code.
                  </p>
                )}
              </form>

              <button
                type="button"
                className="checkout-btn btn btn-success btn-block"
                onClick={handleButtonClick}
              >
                Make Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
