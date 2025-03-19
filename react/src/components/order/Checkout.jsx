import React, { useState, useRef, useEffect } from "react";
import "./Checkout.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Checkout() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    postCode: "",
  });

  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [discount, setDiscount] = useState(0);
  const formRef = useRef(null);

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
        const userId = decodedToken?.userId;
        if (!userId) {
          console.error("User ID not found in token");
          setLoading(false);
          return;
        }

        setFormData({
          name: decodedToken.name || "",
          email: decodedToken.email || "",
          phone: decodedToken.phone || "",
          address: "",
          postCode: "",
        });

        const response = await axios.get(
          `http://localhost:3000/cart/${userId}`
        );
        setCart(response.data.cart || { items: [] });
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCart({ items: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePromoChange = (e) => {
    setPromoCode(e.target.value);
  };

  const validatePromoCode = () => {
    if (promoCode === "hello" || promoCode === "joha") {
      setIsPromoValid(true);
      setDiscount(0.15);
    } else {
      setIsPromoValid(false);
      setDiscount(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    if (!userId) {
      console.error("User ID not found in token.");
      return;
    }

    const tran_id = `REF${Date.now()}`;

    const orderDetails = {
      userInfo: {
        id: userId,
      },
      user: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        postCode: formData.postCode,
      },
      cart: cart.items.map((item) => ({
        product: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
        total: (item.productId.price * item.quantity).toFixed(2),
      })),
      totalAmount: calculateTotal().toFixed(2),
      tranjectionId: tran_id,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/checkout",
        orderDetails,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response?.data?.url) {
        window.location.href = response.data.url;
      } else {
        console.log("No URL returned from server");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      // Log error details
      console.error("Error response:", error.response);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
    }
  };

  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const calculateTotal = () => {
    const total = cart.items.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
    return total - total * discount;
  };

  return (
    <div className="checkout-container mt-5">
      <div className="checkout-row mx-4">
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

        <div className="order-summary mx-3">
          <div className="checkout-card">
            <div className="checkout-header summary-header">
              <h5>Order Summary</h5>
            </div>
            <div className="checkout-body mt-4">
              <ul className="summary-list">
                {cart?.items?.length > 0 ? (
                  cart.items.map((item, index) => (
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
                      <li className="divider"></li>
                    </React.Fragment>
                  ))
                ) : (
                  <li>No items in the cart</li>
                )}

                <li className="summary-item">
                  <strong>Shipping:</strong> Free
                </li>

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
