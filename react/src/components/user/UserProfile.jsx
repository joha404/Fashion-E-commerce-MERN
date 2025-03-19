import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./UserProfile.css";
import userImg from "../../assets/img/user.jpg";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve token and userId from localStorage
  const token = localStorage.getItem("token");

  const getUserFromLocalStorage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not logged in.");
        setLoading(false);
        return null;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken?.userId;
      if (!userId) {
        setError("Invalid token. Please log in again.");
        setLoading(false);
        return null;
      }

      const response = await axios.get(`http://localhost:3000/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
      return response.data._id; // Return userId for fetching orders
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to fetch user data.");
      setLoading(false);
      return null;
    }
  };

  // 2️⃣ Method to Get Orders by User ID
  const fetchOrdersByUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not logged in.");
        setLoading(false);
        return null;
      }

      const response = await axios.get(
        `http://localhost:3000/checkout/user/${userId}`, // Corrected URL format
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = await getUserFromLocalStorage();
      if (userId) {
        fetchOrdersByUser(userId);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="row profile">
        {/* Profile Sidebar */}
        <div className="col-md-3 col-12">
          <div className="profile-sidebar">
            <div className="profile-userpic text-center">
              <img src={userImg} className="img-fluid" alt="User" />
            </div>

            <div className="profile-usertitle">
              <div className="profile-usertitle-name">
                <p>{user ? user.name : "User Name"}</p>
                <p>{user ? user.email : "User Email"}</p>
                <p>{user ? user.phone : "User Phone"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="col-md-9 col-12">
          <div className="profile-content">
            <div className="container pt-4 px-4">
              <div className="text-center mt-4">
                <h2>Welcome to your Profile</h2>
              </div>
              <p className="orderParagraph">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos,
                dolore. Voluptate odit laborum maiores aperiam quo consectetur
                eos consequuntur nemo minus pariatur.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <h2 className="text-center mt-4">Your Orders</h2>
      <div className="bg-light text-center rounded p-4">
        <div className="d-flex align-items-center mb-4">
          <h6 className="mb-0">Orders</h6>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p>{error}</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table text-center align-middle table-bordered table-hover mb-0">
              <thead className="orderThead">
                <tr className="text-dark">
                  <th scope="col">Date</th>
                  <th scope="col"> Name</th>
                  <th scope="col" className="d-none d-md-table-cell">
                    Address
                  </th>
                  <th scope="col" className="d-none d-md-table-cell">
                    Phone
                  </th>
                  <th scope="col" className="d-none d-md-table-cell">
                    Quantity
                  </th>
                  <th scope="col"> Price</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="d-none d-md-table-cell">
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.reverse().map((order) => (
                  <tr key={order._id}>
                    <td className="text-center">
                      {new Date(order.createdAt).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="text-center">
                      {order.user?.name?.length > 10
                        ? `${order.user.name.slice(0, 10)}...`
                        : order.user.name}
                    </td>
                    <td className="text-center d-none d-md-table-cell">
                      {order.user?.address?.length > 10
                        ? `${order.user.address.slice(0, 19)}...`
                        : order.user.address}
                    </td>
                    <td className="text-center d-none d-md-table-cell">
                      {order.user?.phone || "N/A"}
                    </td>
                    <td className="text-center d-none d-md-table-cell">
                      {order.cart.reduce((acc, item) => acc + item.quantity, 0)}
                    </td>
                    <td className="text-center">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge ${
                          order.status === "Approved"
                            ? "status-approved"
                            : order.status === "Pending"
                            ? "status-pending"
                            : order.status === "Rejected"
                            ? "status-rejected"
                            : "status-default"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="text-center d-none d-md-table-cell">
                      {order.tranjectionId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
