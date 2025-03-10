const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const DBConnect = require("./config/db");
const SSLCommerzPayment = require("sslcommerz-lts");
const orderSchema = require("./models/orderSchema");
const adminRoute = require("./routes/adminRoute");

// Define allowed origins for CORS
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: "*", // This allows all origins
    credentials: true, // Allow cookies
    methods: "GET, POST, PUT, DELETE, OPTIONS", // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Connect to the database
DBConnect();

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
app.use("/checkout", require("./routes/checkoutRoute"));

// Checkout Route
const orderController = require("./controllers/checkoutController");
app.post("/checkout", orderController.processCheckout);

// Payment Success Route
app.post("/success/:tran_id", async (req, res) => {
  const { tran_id } = req.params;

  try {
    const order = await orderSchema.findOne({ tranjectionId: tran_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order's paid status
    const updateResult = await orderSchema.updateOne(
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
