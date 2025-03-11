const SSLCommerzPayment = require("sslcommerz-lts");
const orderSchema = require("../models/orderSchema");

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; // Change to true in production

const processCheckout = async (req, res) => {
  try {
    const { user, cart, totalAmount } = req.body;
    const { name, email, phone, address, postCode } = user || {};

    if (!user || !cart || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!Array.isArray(cart)) {
      return res.status(400).json({ message: "Cart should be an array" });
    }

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

      // Store order in DB with default status "Pending"
      await orderSchema.create({
        user,
        cart,
        totalAmount,
        paidStatus: false,
        tranjectionId: tran_id,
        status: "Pending", // FIX: Added status field
      });
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

const getOrder = async (req, res) => {
  try {
    const allOrders = await orderSchema.find().lean(); // FIX: Added await & lean()
    res.status(200).json(allOrders);
  } catch (error) {
    console.error("Error fetching orders: ", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const statusUpdate = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  await orderSchema.findByIdAndUpdate(orderId, { status });
  res.json({ message: "Order updated" });
};

module.exports = { processCheckout, getOrder, statusUpdate };
