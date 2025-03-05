const express = require("express");
const orderRouter = express.Router();
const { processCheckout } = require("../controllers/checkoutController");

// POST route to handle checkout
orderRouter.post("/", processCheckout);

module.exports = orderRouter;
