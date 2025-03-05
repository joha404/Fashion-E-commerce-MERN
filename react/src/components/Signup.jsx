import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Ensure it's imported
import axios from "axios";
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate(); // Use the hook to navigate

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
    setSuccess(false);

    try {
      const response = await axios.post(
        "http://localhost:3000/create",
        formData
      );
      console.log("Response:", response.data);
      setSuccess(true); // Set success message after successful signup
      setFormData({ name: "", email: "", password: "", number: "" });
      // After successful signup, navigate to login page
      navigate("/login"); // Ensure this is called after the request is complete
    } catch (error) {
      console.error("Error during signup:", error);
      if (error.response) {
        setError(
          error.response.data.message || "An error occurred. Please try again."
        );
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="input-group">
          <label>Username:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your username"
          />
        </div>
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
        <div className="input-group">
          <label>Number:</label>
          <input
            type="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            required
            placeholder="Enter your contact number"
          />
        </div>

        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>

        {success && (
          <p className="success-message">
            Sign up successful! You can now log in.
          </p>
        )}
        {error && <p className="error-message">{error}</p>}
        <div className="haveAccount">
          <Link to="/login" id="text-center">
            Have an Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
