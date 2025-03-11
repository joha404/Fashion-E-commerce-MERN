const express = require("express");
const orderRouter = express.Router();
const {
  processCheckout,
  getOrder,
  statusUpdate,
} = require("../controllers/checkoutController");

// POST route to handle checkout
orderRouter.post("/", processCheckout);
orderRouter.get("/", getOrder);
orderRouter.put("/:id", statusUpdate);

module.exports = orderRouter;
