import React, { useState, useEffect } from "react";
import userImage from "../../assets/img/user.jpg";
import "./UserProfile.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function UserProfile() {
  const [decodedToken, setDecodedToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
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
          `http://localhost:3000/user/${userId}`
        );
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-sm-12 col-md-4 col-lg-4">
          <div className="userProfileSection">
            <div className="userDefaultImage">
              <img src={userImage} alt="User" />
            </div>
            <div className="userDetails">
              <h3 className="userProfileName">
                {userInfo?.name || "Unknown User"}
              </h3>
              <p className="userProfileEmail">
                {userInfo?.email || "No email available"}
              </p>
              <p className="userProfileNumber">
                {userInfo?.number || "No phone available"}
              </p>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-md-8 col-lg-8">
          <div className="userOrder">
            <h1 className="sserOrderDetails">Your Order</h1>
            <div className="showUserOrder">
              <div className="cart-container container">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Transaction Id</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userInfo?.orders?.length > 0 ? (
                      userInfo.orders.map((order, index) => (
                        <tr key={index}>
                          <td>{order.transactionId}</td>
                          <td>
                            <p className="quantity_p mx-2 mt-2">
                              {order.quantity}
                            </p>
                          </td>
                          <td>${order.total}</td>
                          <td>{order.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
