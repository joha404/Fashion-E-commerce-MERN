const AdminSchema = require("../models/AdminSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create Admin (Sign Up)
async function CreateAdmin(req, res) {
  const { username, email, phone, password, reg } = req.body;

  //   if (!username || !email || !phone || !password) {
  //     return res.status(400).json({ message: "All fields are required" });
  //   }

  try {
    // Check if admin already exists
    const adminExists = await AdminSchema.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = new AdminSchema({
      username,
      email,
      phone,
      password: hashedPassword,
      reg,
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        phone: newAdmin.phone,
        password: newAdmin.password,
        reg: newAdmin.reg,
      },
    });
  } catch (err) {
    console.error("Error creating admin:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

// Admin Login
async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await AdminSchema.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "72h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error logging in:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

// Admin Logout
function LogoutAdmin(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
}

// Get Single Admin
async function getSingleAdmin(req, res) {
  try {
    const { adminId } = req.params;

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    const admin = await AdminSchema.findById(adminId).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// Update Admin
async function updateadmin(req, res) {
  try {
    const { adminId } = req.params;
    const { username, email, phone, password } = req.body;

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    let updatedData = { username, email, phone };

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    const updatedAdmin = await AdminSchema.findByIdAndUpdate(
      adminId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password"); // Exclude password

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res
      .status(200)
      .json({ message: "Admin updated successfully", admin: updatedAdmin });
  } catch (err) {
    console.error("Error updating admin:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

// Delete Admin
async function deleteadmin(req, res) {
  try {
    const { adminId } = req.params;

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    const deletedAdmin = await AdminSchema.findByIdAndDelete(adminId);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Error deleting admin:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

module.exports = {
  CreateAdmin,
  loginAdmin,
  LogoutAdmin,
  getSingleAdmin,
  updateadmin,
  deleteadmin,
};
