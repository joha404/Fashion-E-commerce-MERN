const SSLCommerzPayment = require("sslcommerz-lts");
const Order = require("../models/orderSchema");
const mongoose = require("mongoose");
require("dotenv").config();

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; // Change to true in production

// 🛒 Process Checkout
const processCheckout = async (req, res) => {
  try {
    const { cart, totalAmount, userInfo } = req.body;
    console.log(userInfo);
    // Validation: Check if user data is present
    if (
      !userInfo.id ||
      !userInfo.name ||
      !userInfo.email ||
      !userInfo.phone ||
      !userInfo.address ||
      !userInfo.postCode
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields in user data" });
    }

    // Validation: Check if cart is an array and totalAmount is a valid number
    if (!Array.isArray(cart) || cart.length === 0) {
      return res
        .status(400)
        .json({ message: "Cart should be a non-empty array" });
    }
    if (isNaN(totalAmount)) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    // Extract user details
    const { name, email, phone, address, postCode } = user;

    const tran_id = `REF${Date.now()}`;
    const data = {
      total_amount: totalAmount,
      currency: "BDT",
      tran_id,
      success_url: `http://localhost:3000/success/${tran_id}`,
      fail_url: "http://localhost:3030/fail",
      cancel_url: "http://localhost:3030/cancel",
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_name: cart.map((item) => item.product).join(", "),
      product_category: "Electronic",
      product_profile: "general",
      cus_name: name,
      cus_email: email,
      cus_add1: address,
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: postCode,
      cus_country: "Bangladesh",
      cus_phone: phone,
      cus_fax: phone,
      ship_name: name,
      ship_add1: address,
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: postCode,
      ship_country: "Bangladesh",
    };

    const sslcz = new SSLCommerzPayment(
      process.env.SSL_STORE_ID,
      process.env.SSL_STORE_PASSWD,
      process.env.SSL_IS_LIVE === "true"
    );

    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      res.json({ url: apiResponse.GatewayPageURL });

      // Save order to the database
      await Order.create({
        user: {
          name,
          email,
          phone,
          address,
          postCode,
        },
        userInfo: userInfo ? new mongoose.Types.ObjectId(userInfo) : null,
        cart,
        totalAmount,
        paidStatus: false,
        tranjectionId: tran_id,
        status: "Pending",
      });
    } else {
      res.status(500).json({ message: "Error initializing payment gateway" });
    }
  } catch (error) {
    console.error("Error in processing checkout: ", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 📦 Get All Orders
const getOrder = async (req, res) => {
  try {
    const allOrders = await Order.find().populate("userInfo").lean();
    res.status(200).json(allOrders);
  } catch (error) {
    console.error("Error fetching orders: ", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// 🔄 Update Order Status
const statusUpdate = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status: ", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { processCheckout, getOrder, statusUpdate };
