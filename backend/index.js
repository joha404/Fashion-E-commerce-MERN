const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();
const DBConnect = require("./config/db");
const path = require("path");
const cors = require("cors");
const SSLCommerzPayment = require("sslcommerz-lts");
const orderSchema = require("./models/orderSchema");
const fs = require("fs");

app.use(
  cors({
    origin: "http://localhost:5173", // Change this to your frontend URL
    credentials: true, // Allows cookies to be sent/received
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

DBConnect();
app.use(bodyParser.json());
const port = process.env.PORT;

app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Home Page");
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
const userRoutes = require("./routes/userRoute");
app.use("/", userRoutes);

const categoryRoutes = require("./routes/categoryRoute");
app.use("/category", categoryRoutes);

const productRoutes = require("./routes/productRoute");
app.use("/product", productRoutes);

const cartRoutes = require("./routes/cartRoute");
app.use("/cart", cartRoutes);

const wishlistRouter = require("./routes/wishlistRoute");
app.use("/wishlist", wishlistRouter);

const messageRouter = require("./routes/messageRoute");
app.use("/", messageRouter);
// Order Routes (Checkout Logic)
const orderController = require("./controllers/checkoutController"); // Import the orderController.js
const OrderRoutes = require("./routes/checkoutRoute"); // Checkout route
app.use("/checkout", OrderRoutes);

// Add checkout POST route directly in index.js
app.post("/checkout", orderController.processCheckout);

app.post("/success/:tran_id", async (req, res) => {
  const { tran_id } = req.params;

  try {
    const order = await orderSchema.findOne({ tranjectionId: tran_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order's paid status to true
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
      console.log(`Order with ID ${tran_id} was not updated.`);
      return res.status(400).json({ message: "Failed to update order status" });
    }
  } catch (error) {
    console.error("Error while updating the order: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
});

// Payment Failure Route
app.post("/fail", (req, res) => {
  console.log("Payment failed.");
  res.send("Payment failed");
});

app.listen(port, () => {
  console.log(`Server Running on ${port}`);
});
