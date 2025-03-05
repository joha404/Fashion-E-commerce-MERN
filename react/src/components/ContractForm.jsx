import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default function ContractForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isAgree, setIsAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    setIsAgree(e.target.checked);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAgree) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    setLoading(true);
    setError("");

    const { name, email, message } = formData;

    // Ensure the message is an array
    let messageArray = Array.isArray(message)
      ? message
      : message.split("\n").filter(Boolean); // Split by line breaks and remove empty entries

    // Validate if name, email, and message fields are filled
    if (!name?.trim() || !email?.trim() || messageArray.length === 0) {
      setError("All fields must be filled out.");
      setLoading(false);
      return;
    }

    // Ensure each message in the array is non-empty
    const invalidMessages = messageArray.some((msg) => !msg?.trim());

    if (invalidMessages) {
      setError("All messages must be non-empty.");
      setLoading(false);
      return;
    }

    // Get token from cookies
    const token = Cookies.get("token");

    try {
      const response = await axios.post(
        "http://localhost:3000/message",
        {
          name,
          userId: "67bdcd9cd0fd9d021952b78f", // Replace with the actual user ID
          email,
          messages: messageArray, // Send the array of messages
        },
        {
          withCredentials: true, // Ensure cookies are sent along with the request
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add the token in the Authorization header if necessary
          },
        }
      );

      console.log("Response:", response);
      console.log("Message sent:", response.data);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      setError(""); // Clear any existing error messages
      Swal.fire({
        title: "Drag me!",
        icon: "success",
        draggable: true,
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-information padding-large">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="section-header">
              <h2 className="section-title">Get in touch</h2>
            </div>
            <div className="contact-detail">
              <div className="detail-list">
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
                <ul className="list-unstyled list-icon">
                  <li>
                    <a href="tel:+16502430000">
                      <i className="icon icon-phone"></i> +1 650-243-0000
                    </a>
                  </li>
                  <li>
                    <a href="mailto:info@yourcompany.com">
                      <i className="icon icon-mail"></i> info@yourcompany.com
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="icon icon-map-pin"></i> North Melbourne VIC
                      3051, Australia
                    </a>
                  </li>
                </ul>
              </div>
              <div className="social-links">
                <h3>Social Links</h3>
                <ul className="d-flex list-unstyled">
                  <li>
                    <a href="#" className="icon icon-facebook"></a>
                  </li>
                  <li>
                    <a href="#" className="icon icon-twitter"></a>
                  </li>
                  <li>
                    <a href="#" className="icon icon-instagram"></a>
                  </li>
                  <li>
                    <a href="#" className="icon icon-youtube-play"></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="contact-information">
              <div className="section-header">
                <h2 className="section-title">Send us a message</h2>
              </div>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-item">
                  <input
                    type="text"
                    minLength="2"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="u-full-width bg-light"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="E-mail"
                    className="u-full-width bg-light"
                    required
                  />
                  <textarea
                    className="u-full-width bg-light"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Message"
                    style={{ height: "180px" }}
                    required
                  ></textarea>
                </div>
                <label>
                  <input
                    type="checkbox"
                    required
                    checked={isAgree}
                    onChange={handleCheckboxChange}
                  />
                  <span className="label-body">
                    I agree to all the <a href="#">terms and conditions</a>
                  </span>
                </label>
                {error && <p className="error">{error}</p>}
                <button
                  type="submit"
                  name="submit"
                  className="btn btn-dark btn-full btn-medium"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
