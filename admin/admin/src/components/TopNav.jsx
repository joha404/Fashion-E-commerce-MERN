import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAvatar from "../../assets/img/user.jpg";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function TopNav() {
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [decodedToken, setDecodedToken] = useState(null);
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/messages`);
        console.log("response is : ", response.data[0]);
      } catch (error) {
        console.error("Error fetching message:", error);
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
            {[...Array(3)].map((_, index) => (
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
                      <h6 className="fw-normal mb-0">
                        John sent you a message
                      </h6>
                      <small>15 minutes ago</small>
                    </div>
                  </div>
                </a>
                {index < 2 && <hr className="dropdown-divider" />}
              </React.Fragment>
            ))}
            <a href="#" className="dropdown-item text-center">
              See all messages
            </a>
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

        {/* User Profile Dropdown */}
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
            <span className="d-none d-lg-inline-flex">John Doe</span>
          </a>
          <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
            <a href="#" className="dropdown-item">
              My Profile
            </a>
            <a href="#" className="dropdown-item">
              Settings
            </a>
            <a href="#" className="dropdown-item">
              Log Out
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
