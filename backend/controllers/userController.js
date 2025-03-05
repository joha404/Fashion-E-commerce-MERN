const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create User (Sign Up)
async function CreateUser(req, res) {
  const { name, email, number, password } = req.body;

  if (!name || !email || !number || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      number,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        number: newUser.number,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
}

// Login User
async function LoginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "72h",
    });

    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
}

// Logout User
function LogoutUser(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
}

// Get Single User
async function getSingleUser(req, res) {
  try {
    const { userId } = req.params;

    // Find user by ID
    const user = await userModel.findById(userId);

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send valid JSON response
    res.status(200).json({
      _id: user._id.toString(), // Ensure it's a string
      name: user.name,
      email: user.email,
      number: user.number.toString(), // Ensure it's a string
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// Update User
async function updateUser(req, res) {
  try {
    const { userId } = req.params;
    const { name, email, number, password } = req.body;

    let updatedData = { name, email, number };

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updatedData, {
        new: true,
        runValidators: true,
      })
      .select("-password"); // Exclude password

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
}

// Delete User
async function deleteUser(req, res) {
  try {
    const { userId } = req.params;
    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
}

module.exports = {
  CreateUser,
  LoginUser,
  LogoutUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
