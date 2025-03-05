const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false;
const orderSchema = require("../models/orderSchema");

exports.processCheckout = async (req, res) => {
  try {
    const { user, cart, totalAmount } = req.body;
    const { name, email, phone, address, postCode } = user;

    // Check if required fields are present
    if (!user || !cart || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure cart is an array
    if (!Array.isArray(cart)) {
      return res.status(400).json({ message: "Cart should be an array" });
    }

    const tran_id = `REF${new Date().getTime()}`;

    const data = {
      total_amount: totalAmount,
      currency: "BDT",
      tran_id: tran_id,
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
      cus_add2: "",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: postCode,
      cus_country: "Bangladesh",
      cus_phone: phone,
      cus_fax: phone,
      ship_name: name,
      ship_add1: address,
      ship_add2: "",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: postCode,
      ship_country: "Bangladesh",
    };

    // Initialize SSLCommerz Payment
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    // Use async/await to handle the payment initialization
    const apiResponse = await sslcz.init(data);

    let GatewayPageURL = apiResponse?.GatewayPageURL;
    if (GatewayPageURL) {
      // Send the payment gateway URL to the client
      res.send({ url: GatewayPageURL });

      // Store the order in your database with paidStatus as false
      const finalOrder = {
        user,
        cart,
        totalAmount,
        paidStatus: false, // Set to false initially
        tranjectionId: tran_id, // Transaction ID
      };

      // Assuming you're using Mongoose to interact with MongoDB
      const result = await orderSchema.create(finalOrder); // Use .create() if using Mongoose
    } else {
      return res
        .status(500)
        .json({ message: "Error in payment gateway initialization" });
    }
  } catch (error) {
    console.error("Error in processing checkout: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};
