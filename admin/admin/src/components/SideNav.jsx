import React from "react";
import userAvatar from "../../assets/img/user.jpg";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom"; // Only import Link here

export default function SideNav() {
  return (
    <div className="sidebar pe-4 pb-3">
      <nav className="navbar bg-light navbar-light">
        <a href="index.html" className="navbar-brand mx-4 mb-3">
          <h3 className="text-primary">
            <i className="fa fa-hashtag me-2"></i>DASHMIN
          </h3>
        </a>
        <div className="d-flex align-items-center ms-4 mb-4">
          <div className="position-relative">
            <img className="rounded-circle" src={userAvatar} alt="" />
            <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
          </div>
          <div className="ms-3">
            <h6 className="mb-0">Jhon Doe</h6>
            <span>Admin</span>
          </div>
        </div>
        <div className="navbar-nav w-100">
          <Link to="/" className="nav-item nav-link my-2 ">
            <i className="fa fa-tachometer-alt me-2"></i>Dashboard
          </Link>

          <Link to="/product" className="nav-item my-2 nav-link">
            <i className="fa fa-th me-2"></i>Products
          </Link>
          <Link to="/category" className="nav-item my-2 nav-link">
            <i className="fa fa-solid fa-layer-group"></i>Category
          </Link>
          <Link to="/orders" className="nav-item my-2 nav-link">
            <i className="fa-solid fa-arrow-down-wide-short"></i>Order
          </Link>
          <Link to="/selling-history" className="nav-item my-2 nav-link">
            <i className="fa fa-solid fa-landmark-dome"></i>Selling History
          </Link>
          <Link to="/employee" className="nav-item my-2 nav-link">
            <i className="fa fa-solid fa-user-tie"></i>Employee
          </Link>
          <Link to="/customers" className="nav-item my-2 nav-link">
            <i className="fa fa-solid fa-users"></i>Customers
          </Link>
          <Link to="/settings" className="nav-item my-2 nav-link">
            <i className="fa fa-solid fa-gear"></i>Setting
          </Link>
        </div>
      </nav>
    </div>
  );
}
