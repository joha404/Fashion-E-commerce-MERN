const express = require("express");
const adminRouter = express.Router();
const {
  CreateAdmin,
  loginAdmin,
  LogoutAdmin,
  getSingleAdmin,
  updateadmin,
  deleteadmin,
} = require("../controllers/AdminController"); // Adjust path as necessary

// POST route to create a new user
adminRouter.post("/create", CreateAdmin);

// POST route for login
adminRouter.post("/login", loginAdmin);

// POST route for logout
adminRouter.post("/logout", LogoutAdmin);
adminRouter.get("/:userId", getSingleAdmin);
adminRouter.put("/:userId", updateadmin);
adminRouter.delete("/:userId", deleteadmin);

module.exports = adminRouter;
