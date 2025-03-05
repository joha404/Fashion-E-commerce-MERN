import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Topnav.css";

export default function TopNav() {
  const [token, setToken] = useState(null); // Initialize token state

  // Function to get the token from cookies
  const getTokenFromCookies = () => {
    const cookies = document.cookie.split(";"); // Split all cookies into an array
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim(); // Trim any leading spaces
      if (cookie.startsWith("token=")) {
        return cookie.substring("token=".length); // Return the value of the token
      }
    }
    return null; // Return null if token is not found
  };

  // Function to get token from localStorage
  const getTokenFromLocalStorage = () => {
    return localStorage.getItem("token"); // Return token from localStorage
  };

  useEffect(() => {
    // Get the token from localStorage or cookies
    const localStorageToken = getTokenFromLocalStorage();
    const cookieToken = getTokenFromCookies();
    setToken(localStorageToken || cookieToken); // Set token from localStorage or cookies
    // Log token for debugging
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST", // Change GET to POST
        credentials: "include", // Ensures cookies are sent
      });

      if (response.ok) {
        // Remove token from localStorage and cookies
        localStorage.removeItem("token");
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; // Expire the cookie

        // Update the token state
        setToken(null); // This will trigger a re-render

        // Redirect to login page
        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <nav className="secondary-nav border-bottom">
        <div className="container">
          <div className="row d-flex align-items-center">
            <div className="col-md-4 header-contact">
              <p>
                Let's talk! <strong>+57 444 11 00 35</strong>
              </p>
            </div>
            <div className="col-md-4 shipping-purchase text-center">
              <p>Free shipping on a purchase value of $200</p>
            </div>
            <div className="col-md-4 col-sm-12 user-items">
              <ul className="d-flex justify-content-end list-unstyled">
                <li className="mx-2">
                  <Link to="/cart">
                    <i className="icon icon-shopping-cart"></i>
                  </Link>
                </li>
                <li className="mx-2">
                  <Link to="/wishlist">
                    <i className="icon icon-heart"></i>
                  </Link>
                </li>

                <Dropdown>
                  <Dropdown.Toggle className="dropdown-toggle-custom">
                    <i className="icon icon-user"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {token ? (
                      <>
                        <Dropdown.Item>
                          {" "}
                          <Link to="/profile"> Profile </Link>
                        </Dropdown.Item>
                        <Dropdown.Item>Settings</Dropdown.Item>
                        <Dropdown.Item>
                          <Link to="/login" onClick={handleLogout}>
                            Logout
                          </Link>
                        </Dropdown.Item>
                      </>
                    ) : (
                      <>
                        <Dropdown.Item>
                          <Link to="/login"> Log In </Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <Link to="/signup">Sign Up </Link>
                        </Dropdown.Item>
                      </>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
