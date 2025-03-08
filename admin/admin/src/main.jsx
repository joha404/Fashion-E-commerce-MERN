import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./views/Login.jsx";

const root = createRoot(document.getElementById("root"));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null represents the loading state

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Set authentication state based on the presence of token
  }, []); // Empty dependency array to ensure this runs once on component mount

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading state while checking for authentication
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect to login if not authenticated */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        {/* Protect the dashboard route */}
        <Route
          path="/dashboard/*"
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        />
        {/* Handle unknown routes */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

root.render(<App />);
