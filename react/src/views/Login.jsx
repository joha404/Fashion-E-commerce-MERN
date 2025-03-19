import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import the useNavigate hook
import "./login.css"; // Import CSS for styling

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize navigate function

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        formData,
        {
          withCredentials: true, // Sends cookies with the request
          headers: { "Content-Type": "application/json" },
        }
      );

      // Assuming the token is inside response.data.token
      const token = response.data.token;
      console.log("Token is :", token);
      if (token) {
        localStorage.setItem("token", token); // Store token in localStorage
        console.log("Token stored in localStorage:", token); // Debugging log
      }

      // Redirect if login is successful
      navigate("/"); // Using the navigate function instead of window.location.href
    } catch (error) {
      console.error("Error during login:", error);
      setError(
        error.response?.data?.message ||
          "Invalid credentials or an error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>
        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </div>
        <Link to="/signup" className="text-center">
          Create an Account
        </Link>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
