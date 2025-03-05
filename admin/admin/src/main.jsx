import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Layout />
  </BrowserRouter>
);
