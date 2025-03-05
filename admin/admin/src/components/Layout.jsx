import React from "react";
import { Routes, Route } from "react-router-dom";
import layoutcss from "./layout.module.css";
import TopNav from "./TopNav.jsx";
import SideNav from "./SideNav.jsx";
import Category from "../views/Category.jsx";
import Product from "../views/Product.jsx";
import Dashboard from "../views/Dashboard.jsx";
import Order from "../views/Order.jsx";

export default function Layout() {
  return (
    <div>
      <div className={layoutcss.nav}>
        <TopNav />
      </div>
      <div className={layoutcss.sidenav}>
        <SideNav />
      </div>
      <div className={layoutcss.main}>
        <div className={layoutcss.content}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/product" element={<Product />} />
            <Route path="/category" element={<Category />} />
            <Route path="/orders" element={<Order />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
