const SSLCommerzPayment = require("sslcommerz-lts");
const Order = require("../models/orderSchema");
const mongoose = require("mongoose");
require("dotenv").config();

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.SSL_IS_LIVE === "true"; // Convert to boolean

// 🛒 Process Checkout
const processCheckout = async (req, res) => {
  try {
    const { user, cart, totalAmount, userInfo } = req.body;

    // Validate user data
    if (
      !user ||
      !user.name ||
      !user.email ||
      !user.phone ||
      !user.address ||
      !user.postCode
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields in user data" });
    }

    // Validate cart and totalAmount
    if (!Array.isArray(cart) || cart.length === 0) {
      return res
        .status(400)
        .json({ message: "Cart should be a non-empty array" });
    }
    if (isNaN(totalAmount)) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    // Ensure userInfo is a valid ObjectId
    if (
      !userInfo ||
      !userInfo.id ||
      !mongoose.Types.ObjectId.isValid(userInfo.id)
    ) {
      return res.status(400).json({ message: "Invalid userInfo ID" });
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

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      res.json({ url: apiResponse.GatewayPageURL });

      // Save order in database
      try {
        const createOrder = await Order.create({
          user: { name, email, phone, address, postCode },
          userInfo: new mongoose.Types.ObjectId(userInfo.id),
          cart,
          totalAmount,
          paidStatus: false,
          tranjectionId: tran_id,
          status: "Pending",
        });
      } catch (orderError) {
        console.error("Order creation failed:", orderError);
      }
    } else {
      res.status(500).json({ message: "Error initializing payment gateway" });
    }
  } catch (error) {
    console.error("Error in processing checkout: ", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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

const getUserOrder = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    const orders = await Order.find({ userInfo: userId })
      .populate("userInfo")
      .lean();

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
// const deleteUserOrders = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Validate user ID
//     if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid or missing user ID" });
//     }

//     // Delete orders linked to the user
//     const deletedOrders = await Order.deleteMany({ userInfo: userId });

//     if (deletedOrders.deletedCount === 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "No orders found for this user" });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "All orders for this user have been deleted successfully",
//       deletedCount: deletedOrders.deletedCount,
//     });
//   } catch (error) {
//     console.error("Error deleting user orders:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

// 🔄 Update Order Status
const statusUpdate = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteOrderFinish = await Order.findByIdAndDelete(id);
    return res.status(201).json({
      success: true,
      message: "Order completed successfully",
      data: deleteOrderFinish,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
module.exports = {
  processCheckout,
  getOrder,
  getUserOrder,
  statusUpdate,
  deleteOrder,
};
