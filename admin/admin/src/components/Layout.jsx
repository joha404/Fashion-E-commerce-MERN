import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import layoutcss from "./layout.module.css";
import TopNav from "./TopNav.jsx";
import SideNav from "./SideNav.jsx";
import Category from "../views/Category.jsx";
import Product from "../views/Product.jsx";
import Dashboard from "../views/Dashboard.jsx";
import Order from "../views/Order.jsx";
import Messages from "../views/Messages.jsx";

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track authentication state

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Update state based on token
  }, []); // Runs once on component mount

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Optionally, show loading state while checking authentication
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // If not authenticated, redirect to login
  }

  return (
    <div className={layoutcss.container}>
      <div className={layoutcss.nav}>
        <TopNav />
      </div>
      <div className={layoutcss.wrapper}>
        <div className={layoutcss.sidenav}>
          <SideNav />
        </div>
        <div className={layoutcss.main}>
          <div className={layoutcss.content}>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="product" element={<Product />} />
              <Route path="category" element={<Category />} />
              <Route path="orders" element={<Order />} />
              <Route path="messages" element={<Messages />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
