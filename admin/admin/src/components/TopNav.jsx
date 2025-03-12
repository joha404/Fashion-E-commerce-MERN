import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import userAvatar from "../../assets/img/user.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Dropdown } from "bootstrap";
import "./TopNav.css";

export default function TopNav() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [adminName, setAdminName] = useState("Admin");
  const navigate = useNavigate();

  useEffect(() => {
    const dropdownElements = document.querySelectorAll(".dropdown-toggle");
    dropdownElements.forEach((dropdown) => {
      new Dropdown(dropdown);
    });
    const localStorageToken = localStorage.getItem("token");
    const cookieToken =
      document.cookie
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("token="))
        ?.split("=")[1] || null;
    const currentToken = localStorageToken || cookieToken;
    setToken(currentToken);

    if (currentToken) {
      fetchAdminName(currentToken);
    }
  }, []);

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
      const response = await axios.post(
        "http://localhost:3000/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("adminName");
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setToken(null);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:3000/messages");
        if (Array.isArray(response.data)) {
          setMessages(response.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
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
        <div className="nav-item dropdown">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            id="messagesDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-envelope me-lg-2"></i>
            <span className="d-none d-lg-inline-flex">Message</span>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-end messagesAllItem"
            aria-labelledby="messagesDropdown"
          >
            {loading ? (
              <li className="dropdown-item ">Loading messages...</li>
            ) : messages.length > 0 ? (
              messages.slice(-3).map((item, index) => (
                <React.Fragment key={index}>
                  <li className="dropdown-item messageDropdownItem">
                    <div className=" ">
                      <div className="d-flex justify-content-between">
                        <img
                          className="rounded-circle"
                          src={userAvatar}
                          alt="User"
                          style={{ width: "40px", height: "40px" }}
                        />
                        <p className="dateMessagesP">
                          {new Date(item.updatedAt).toLocaleDateString(
                            "en-BD",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </p>
                      </div>
                      <div className="ms-2 mt-1">
                        <div className="messagesAndDate  ">
                          <h6>{item.email}</h6>
                        </div>

                        <p className="PMessages">{item.messages?.at(-1)}</p>
                      </div>
                    </div>
                  </li>
                  {index < 2 && <hr className="dropdown-divider" />}
                </React.Fragment>
              ))
            ) : (
              <li className="dropdown-item text-center">No messages</li>
            )}
            <li>
              <Link
                to="/dashboard/messages"
                className="dropdown-item text-center"
              >
                See all messages
              </Link>
            </li>
          </ul>
        </div>

        <div className="nav-item dropdown">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            id="profileDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              className="rounded-circle me-lg-2"
              src={userAvatar}
              alt="User"
              style={{ width: "40px", height: "40px" }}
            />
            <span className="d-none d-lg-inline-flex">{adminName}</span>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="profileDropdown"
          >
            <li>
              <a href="#" className="dropdown-item">
                My Profile
              </a>
            </li>
            <li>
              <a href="#" className="dropdown-item">
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="dropdown-item" onClick={handleLogout}>
                Log Out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
