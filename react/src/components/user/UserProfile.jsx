import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAvatar from "../../assets/img/user.jpg";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function TopNav() {
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  // Function to get the token from localStorage
  const getTokenFromLocalStorage = () => {
    const token = localStorage.getItem("token");
    if (token) {
      return token;
    } else {
      console.warn("No authentication token found in localStorage");
      return null;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getTokenFromLocalStorage(); // Fetch token from localStorage

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

        const response = await axios.get(
          `http://localhost:3000/user/${userId}`
        );
        setAdminName(response.data.name); // Assuming response contains admin name or user name
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("token"); // Remove token from localStorage
        setAdminName("");
        navigate("/"); // Redirect to home page or login page
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0 container">
      <div className="navbar-nav align-items-center ms-auto">
        <div className="nav-item dropdown">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <img
              className="rounded-circle me-lg-2"
              src={userAvatar}
              alt=""
              style={{ width: "40px", height: "40px" }}
            />
            <span className="d-none d-lg-inline-flex">
              {adminName || "Admin"}
            </span>
          </a>
          <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
            <a href="#" className="dropdown-item">
              My Profile
            </a>
            <a href="#" className="dropdown-item">
              Settings
            </a>
            <a href="#" className="dropdown-item" onClick={handleLogout}>
              Log Out
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
