import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Instagram from "./components/Instagram";
import NotFound from "./components/notFound/PageNoutFound";
import Navbar from "./components/Navbar";
import TopNav from "./components/TopNav";
import About from "./views/About";
import Blog from "./views/Blog";
import Contract from "./views/Contract";
import Home from "./views/Home";
import Login from "./views/Login";
import Signup from "./components/Signup";
import Wishlist from "./components/wishlist/Wishlist";
import Product from "./components/products/SingleProduct";
import AllCart from "./components/cart/AllCart";
import Checkout from "./components/order/Checkout";
import UserProfile from "./components/user/UserProfile";

function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 500) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <Router>
        <TopNav />
        <Navbar isScrolled={isScrolled} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contract />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<AllCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
        <Instagram />

        <Footer />
      </Router>
    </>
  );
}

export default App;
