const express = require("express");
const router = express.Router();
const {
  CreateUser,
  LoginUser,
  LogoutUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController"); // Adjust path as necessary

// POST route to create a new user
router.post("/create", CreateUser);

// POST route for login
router.post("/login", LoginUser);

// POST route for logout
router.post("/logout", LogoutUser);
router.get("/user/:userId", getSingleUser);
router.put("/user/:userId", updateUser);
router.delete("/user/:userId", deleteUser);

module.exports = router;
