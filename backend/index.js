const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const DBConnect = require("./config/db");
const Order = require("./models/orderSchema"); // Ensure this is the correct path to your Order model

const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://mern-ecommerce-front-pi.vercel.app",
];

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to the database

export default async function handler(req, res) {
  try {
    await DBConnect();
    res.status(200).json({ message: "API working!" });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Define port with a fallback value
const port = process.env.PORT || 5000;

// Home route
app.get("/", (req, res) => {
  res.send("Home Page");
});

// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import and use routes
app.use("/", require("./routes/userRoute"));
app.use("/admin", require("./routes/adminRoute"));
app.use("/category", require("./routes/categoryRoute"));
app.use("/product", require("./routes/productRoute"));
app.use("/cart", require("./routes/cartRoute"));
app.use("/wishlist", require("./routes/wishlistRoute"));
app.use("/", require("./routes/messageRoute"));

// Use checkout routes
app.use("/checkout", require("./routes/checkoutRoute"));
app.use("/complete", require("./routes/CompleteOrderRoute"));

// Payment Success Route
app.post("/success/:tran_id", async (req, res) => {
  const { tran_id } = req.params;

  try {
    const order = await Order.findOne({ tranjectionId: tran_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order's paid status
    const updateResult = await Order.updateOne(
      { tranjectionId: tran_id },
      { $set: { paidStatus: true } }
    );

    if (updateResult.modifiedCount > 0) {
      fs.readFile(
        path.join(__dirname, "public", "payment-success.html"),
        "utf-8",
        (err, data) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error reading success page" });
          }
          return res.send(data);
        }
      );
    } else {
      return res.status(400).json({ message: "Failed to update order status" });
    }
  } catch (error) {
    console.error("Error while updating the order:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

// Payment Failure Route
app.post("/fail", (req, res) => {
  console.log("Payment failed.");
  res.send("Payment failed");
});

// Start the server
app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
