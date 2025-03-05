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
  const [isMobile, setIsMobile] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        if (!token) {
          console.warn("No authentication token found");
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(token);
        setDecodedToken(decodedToken); // Save decodedToken to state
        const userId = decodedToken.userId;
        if (!userId) {
          console.error("User ID not found in token");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/cart/${userId}`
        );

        if (response.data && response.data.cart) {
          if (Array.isArray(response.data.cart.items)) {
            setCart(response.data.cart.items);
          } else {
            console.warn("Cart items are not an array");
            setCart([]);
          }
        } else {
          console.warn("No cart data found");
          setCart([]);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();

    // Handle window resize to determine if it's mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleRemoveItem = async (index, item) => {
    try {
      // Get the authentication token and decode it to get the userId
      const token = Cookies.get("token");
      if (!token) {
        console.warn("No authentication token found");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      if (!userId) {
        console.error("User ID not found in token");
        return;
      }

      // Get the productId of the item to remove
      const productId = item.productId._id; // Make sure productId is being passed correctly as ObjectId

      // Make the API request to remove the item from the cart (use POST method)
      const response = await axios.post("http://localhost:3000/cart/remove", {
        userId,
        productId,
      });

      Swal.fire({
        title: "Cart Remove Successful",
        icon: "success",
        draggable: true,
      });

      // Update the cart state locally if the removal is successful
      const updatedCart = cart.filter((_, idx) => idx !== index);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const updateCartQuantity = async (userId, productId, quantity) => {
    try {
      const response = await axios.post("http://localhost:3000/cart/update", {
        userId,
        productId,
        quantity,
      });
      console.log("Cart updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const handleProceed = async () => {
    if (!decodedToken) {
      console.warn("No decoded token available");
      return;
    }

    try {
      // Ensure the cart is not empty
      if (cart.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Cart is Empty",
          text: "Please add a product to the cart",
        });
        return; // Exit the function if the cart is empty
      }

      // Check if the userId is decoded and available
      const userId = decodedToken?.userId;
      if (!userId) {
        Swal.fire({
          icon: "error",
          title: "User Not Logged In",
          text: "Please log in to proceed with checkout",
          footer: '<a href="#">Why do I have this issue?</a>',
        });
        return; // Exit if user is not logged in
      }

      // Proceed with updating the cart quantities if userId is available
      for (let item of cart) {
        await updateCartQuantity(
          userId,
          item.productId._id,
          item.quantity,
          item.totalPrice
        );
      }

      // Redirect to checkout if all updates are successful
      window.location.href = "/checkout";
    } catch (error) {
      console.error("Error proceeding with the cart:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again later.",
      });
    }
  };

  const handleIncrement = async (index) => {
    if (!decodedToken) {
      console.warn("No decoded token available");
      return;
    }

    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    setCart(updatedCart);

    const userId = decodedToken.userId;
    const productId = updatedCart[index].productId._id;

    // Update the quantity in the backend
    await updateCartQuantity(userId, productId, updatedCart[index].quantity);
  };

  const handleDecrement = async (index) => {
    if (cart[index].quantity > 1 && decodedToken) {
      const updatedCart = [...cart];
      updatedCart[index].quantity -= 1;
      setCart(updatedCart);

      const userId = decodedToken.userId;
      const productId = updatedCart[index].productId._id;

      // Update the quantity in the backend
      await updateCartQuantity(userId, productId, updatedCart[index].quantity);
    }
  };

  return (
    <>
      {" "}
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
              {cart.map((item, index) => (
                <tr key={item._id || index}>
                  <td>
                    <img
                      src={`http://localhost:3000/${item.productId.image.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt={item.productId.name}
                      className="cart-image"
                    />
                  </td>
                  <td>{item.productId.name || "Unnamed Item"}</td>
                  <td>${item.price}</td>
                  <td>
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleDecrement(index)}
                        className="quantity-btn"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <p className="quantity_p mx-2 mt-2">{item.quantity}</p>
                      <button
                        onClick={() => handleIncrement(index)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    {isMobile ? (
                      <button
                        onClick={() => handleRemoveItem(index, item)}
                        className="remove-btn mobile-remove-btn"
                      >
                        <FaTrashAlt /> {/* Trash icon for mobile */}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRemoveItem(index, item)}
                        className="remove-btn desktop-remove-btn"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button className="mt-3 ms-start" onClick={handleProceed}>
          Proceed
        </button>
      </div>
      <BestSelling />
    </>
  );
}
