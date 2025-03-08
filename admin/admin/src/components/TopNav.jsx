import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAvatar from "../../assets/img/user.jpg";
import axios from "axios";

export default function TopNav() {
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  // Function to get the token from cookies
  const getTokenFromCookies = () => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith("token=")) {
        return cookie.substring("token=".length);
      }
    }
    return null;
  };

  // Function to get token from localStorage
  const getTokenFromLocalStorage = () => localStorage.getItem("token");

  useEffect(() => {
    // Get the token from localStorage or cookies
    const localStorageToken = getTokenFromLocalStorage();
    const cookieToken = getTokenFromCookies();
    const currentToken = localStorageToken || cookieToken;
    setToken(currentToken);

    // Fetch Admin Name from LocalStorage first
    const storedAdminName = localStorage.getItem("adminName");
    if (storedAdminName) {
      setAdminName(storedAdminName);
    } else if (currentToken) {
      fetchAdminName(currentToken);
    }
  }, []);

  // Function to fetch Admin Name from backend
  const fetchAdminName = async (authToken) => {
    try {
      const response = await axios.get("http://localhost:3000/admin-info", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.data?.name) {
        setAdminName(response.data.name);
        localStorage.setItem("adminName", response.data.name);
      }
    } catch (error) {
      console.error("Error fetching admin name:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("adminName");
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setToken(null);

        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get("http://localhost:3000/messages");
        if (Array.isArray(response.data)) {
          setMessage(response.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []);

  return (
    <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0 container">
      <form className="d-none d-md-flex ms-4">
        <input
          className="form-control border-0"
          type="search"
          placeholder="Search"
        />
      </form>
      <div className="navbar-nav align-items-center ms-auto">
        {/* Messages Dropdown */}
        <div className="nav-item dropdown">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <i className="fa fa-envelope me-lg-2"></i>
            <span className="d-none d-lg-inline-flex">Message</span>
          </a>
          <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
            {loading ? (
              <p className="dropdown-item">Loading messages...</p>
            ) : message.length > 0 ? (
              message.slice(-3).map((item, index) => (
                <React.Fragment key={index}>
                  <a href="#" className="dropdown-item">
                    <div className="d-flex align-items-center">
                      <img
                        className="rounded-circle"
                        src={userAvatar}
                        alt=""
                        style={{ width: "40px", height: "40px" }}
                      />
                      <div className="ms-2">
                        <h6 className="mb-0">{item.name}</h6>
                        <small>{item.email}</small>
                        <p>{item.messages?.at(-1)}</p>
                        <p>
                          {new Date(item.updatedAt).toLocaleString("en-BD", {
                            timeZone: "Asia/Dhaka",
                          })}
                        </p>
                      </div>
                    </div>
                  </a>
                  {index < 2 && <hr className="dropdown-divider" />}
                </React.Fragment>
              ))
            ) : (
              <p className="dropdown-item text-center">No messages</p>
            )}
            <Link to="/messages" className="dropdown-item text-center">
              See all messages
            </Link>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="nav-item dropdown">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <i className="fa fa-bell me-lg-2"></i>
            <span className="d-none d-lg-inline-flex">Notification</span>
          </a>
          <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
            {["Profile updated", "New user added", "Password changed"].map(
              (text, index) => (
                <React.Fragment key={index}>
                  <a href="#" className="dropdown-item">
                    <h6 className="fw-normal mb-0">{text}</h6>
                    <small>15 minutes ago</small>
                  </a>
                  {index < 2 && <hr className="dropdown-divider" />}
                </React.Fragment>
              )
            )}
            <a href="#" className="dropdown-item text-center">
              See all notifications
            </a>
          </div>
        </div>

        {/* Admin Profile Dropdown */}
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
