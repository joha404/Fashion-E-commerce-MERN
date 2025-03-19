const express = require("express");
const orderRouter = express.Router();
const {
  processCheckout,
  getOrder,
  statusUpdate,
  getUserOrder,
  deleteOrder,
} = require("../controllers/checkoutController");

// POST route to handle checkout
orderRouter.post("/", processCheckout);
orderRouter.get("/", getOrder);
orderRouter.get("/user/:userId", getUserOrder);
orderRouter.put("/:id", statusUpdate);
orderRouter.delete("/:id", deleteOrder);

module.exports = orderRouter;
