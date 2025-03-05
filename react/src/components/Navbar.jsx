import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion"; // Animation Library
import "./Navbar.css";

const logo = "/images/main-logo.png";

export default function Navbar({ isScrolled }) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Check screen width for mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.nav
      className={`primary-nav padding-small mainNavbar ${
        isScrolled ? "navbar-fixed" : ""
      }`}
      initial={{ opacity: 1, y: 0, scale: 1 }} // Start without animation
      animate={{
        opacity: isScrolled ? 1 : 1, // Keeps opacity as 1
        y: isScrolled ? 0 : 0, // Keeps position as is initially
        scale: isScrolled ? 1 : 1, // Keeps scale as is initially
        boxShadow: isScrolled ? "0px 10px 15px rgba(0, 0, 0, 0.1)" : "none", // Add shadow when scrolled
      }}
      transition={{
        opacity: { duration: 0.5, ease: "easeOut" },
        y: { duration: 0.7, ease: "easeOut" },
        scale: { duration: 0.5, ease: "easeOut" },
        boxShadow: { duration: 0.3, ease: "easeOut" },
      }}
    >
      <div className="container biggest_nav">
        <div className="row d-flex align-items-center">
          {/* Logo */}
          <div className="col-lg-2 col-md-2">
            <div className="main-logo">
              <Link to="/">
                <img src={logo} alt="logo" />
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="col-lg-10 col-md-10">
            <div className="navbar">
              <div
                id="main-nav"
                className="stellarnav d-flex justify-content-end"
              >
                <ul className="menu-list">
                  <li className="menu-item">
                    <Link to="/" className="item-anchor">
                      Home
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/about" className="item-anchor">
                      About
                    </Link>
                  </li>

                  <li className="menu-item">
                    <Link to="/blogs" className="item-anchor">
                      Blog
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/contact" className="item-anchor">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Toggle Button */}
          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} className="menu-btn">
              {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
            </button>
          )}
        </div>

        {/* Mobile Navigation Menu with Animation */}
        <AnimatePresence>
          {isMobile && menuOpen && (
            <motion.div
              className={`mobile-menu ${menuOpen ? "open" : ""}`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <ul>
                <li>
                  <Link to="/" onClick={() => setMenuOpen(false)}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={() => setMenuOpen(false)}>
                    About
                  </Link>
                </li>

                <li>
                  <Link to="/blogs" onClick={() => setMenuOpen(false)}>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={() => setMenuOpen(false)}>
                    Contact
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
