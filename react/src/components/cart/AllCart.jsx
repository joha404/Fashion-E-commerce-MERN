import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { FaTrashAlt } from "react-icons/fa";
import "./AllCart.css";
import BestSelling from "../products/BestSelling";

export default function AllCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [decodedToken, setDecodedToken] = useState(null);

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

        const userId = decodedToken?.userId;
        if (!userId) {
          console.error("User ID not found in token");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/cart/${userId}`
        );
        console.log("Full Cart Response:", response.data); // Debugging

        // Check if the items array has productId properly assigned
        const cartData = response.data?.cart?.items ?? [];
        console.log("Processed Cart Data:", cartData); // Debugging

        setCart(cartData);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveItem = async (index, item) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No authentication token found");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken?.userId;
      if (!userId) {
        console.error("User ID not found in token");
        return;
      }

      const productId = item?.productId?._id; // Ensure productId._id is correctly accessed
      if (!productId) {
        console.error("Product ID not found for removal in:", item);
        return;
      }

      const response = await axios.post("http://localhost:3000/cart/remove", {
        userId,
        productId,
      });

      if (response.status === 200) {
        Swal.fire({ title: "Item Removed", icon: "success", draggable: true });

        // Remove item from frontend state
        setCart((prevCart) =>
          prevCart.filter((cartItem) => cartItem?.productId?._id !== productId)
        );
      } else {
        Swal.fire({ title: "Failed to Remove", icon: "error" });
      }
    } catch (error) {
      console.error("Error removing item:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to remove item",
        icon: "error",
      });
    }
  };

  const updateCartQuantity = async (userId, productId, quantity) => {
    try {
      await axios.post("http://localhost:3000/cart/update", {
        userId,
        productId,
        quantity,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleProceed = async () => {
    if (!decodedToken) {
      console.warn("No decoded token available");
      return;
    }

    if (cart.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Cart is Empty",
        text: "Add products to proceed",
      });
      return;
    }

    const userId = decodedToken.userId;
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "User Not Logged In",
        text: "Log in to proceed",
      });
      return;
    }

    try {
      for (let item of cart) {
        await updateCartQuantity(userId, item.productId._id, item.quantity);
      }
      window.location.href = "/checkout";
    } catch (error) {
      console.error("Error proceeding:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Try again later.",
      });
    }
  };

  const handleIncrement = async (index) => {
    if (!decodedToken) return;

    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity += 1;
      return updatedCart;
    });

    await updateCartQuantity(
      decodedToken.userId,
      cart[index].productId._id,
      cart[index].quantity + 1
    );
  };

  const handleDecrement = async (index) => {
    if (cart[index].quantity > 1 && decodedToken) {
      setCart((prevCart) => {
        const updatedCart = [...prevCart];
        updatedCart[index].quantity -= 1;
        return updatedCart;
      });

      await updateCartQuantity(
        decodedToken.userId,
        cart[index].productId._id,
        cart[index].quantity - 1
      );
    }
  };

  return (
    <div className="cart-container container">
      <h1>Cart Section</h1>
      {loading ? (
        <p>Loading...</p>
      ) : cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => {
              const product = item?.productId || {}; // Ensure productId exists
              const price = product?.price ?? item?.price ?? 0; // Handle price fallback
              const imageUrl = product?.image
                ? `http://localhost:3000/${product.image}`
                : "https://via.placeholder.com/50"; // Fallback image

              return (
                <tr key={item?._id || index}>
                  <td>
                    <img
                      src={imageUrl}
                      className="cart-image"
                      alt={product?.name || "Unnamed Item"}
                    />
                  </td>
                  <td>{product?.name || "Unnamed Item"}</td>
                  <td>${price.toFixed(2)}</td>
                  <td>
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleDecrement(index)}
                        className="quantity-btn"
                        disabled={item?.quantity <= 1}
                      >
                        -
                      </button>
                      <p className="quantity_p mx-2 mt-2">{item?.quantity}</p>
                      <button
                        onClick={() => handleIncrement(index)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>${(price * (item?.quantity ?? 1)).toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => handleRemoveItem(index, item)}
                      className={`remove-btn ${
                        isMobile ? "mobile-remove-btn" : "desktop-remove-btn"
                      }`}
                    >
                      {isMobile ? <FaTrashAlt /> : "Remove"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <button className="mt-3 ms-start" onClick={handleProceed}>
        Proceed
      </button>
      <BestSelling />
    </div>
  );
}
