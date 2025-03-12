import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";
import userImg from "../../assets/img/user.jpg";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve token and userId from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchUserAndOrders = async () => {
      try {
        // Fetch User Info
        const userResponse = await axios.get(
          "http://localhost:3000/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(userResponse.data);
        const userId = userResponse.data._id; // Get userId from response

        // Fetch User Orders
        const ordersResponse = await axios.get(
          `http://localhost:3000/orders/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [token]);

  return (
    <div className="container">
      <div className="row profile">
        <div className="col-md-3">
          <div className="profile-sidebar">
            <div className="profile-userpic text-center">
              <img src={userImg} className="img-responsive" alt="User" />
            </div>

            <div className="profile-usertitle">
              <div className="profile-usertitle-name">
                {user ? user.name : "User Name"}
              </div>
              <div className="profile-usertitle-job">
                {user?.role || "User"}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="profile-content">
            <div className="container pt-4 px-4">
              <div className="bg-light text-center rounded p-4">
                <div className="d-flex align-items-center mb-4">
                  <h6 className="mb-0">User Orders</h6>
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
                      <thead>
                        <tr className="text-dark">
                          <th scope="col">Date</th>
                          <th scope="col">User Name</th>
                          <th scope="col">Address</th>
                          <th scope="col">Phone</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Total Price</th>
                          <th scope="col">Status</th>
                          <th scope="col">Transaction ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.reverse().map((order) => (
                          <tr key={order._id}>
                            <td>
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-BD",
                                { day: "numeric", month: "short" }
                              )}
                            </td>
                            <td>{order.user?.name || "N/A"}</td>
                            <td>{order.user?.address || "N/A"}</td>
                            <td>{order.user?.phone || "N/A"}</td>
                            <td>
                              {order.cart.reduce(
                                (acc, item) => acc + item.quantity,
                                0
                              )}
                            </td>
                            <td>${order.totalAmount.toFixed(2)}</td>
                            <td>{order.status}</td>
                            <td>{order.transactionId || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
