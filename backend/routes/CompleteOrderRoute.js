const express = require("express");
const {
  CreateCompleteOrder,
  getCompleteOrder,
} = require("../controllers/CompleteOrderController");
const CompleteOrderRoute = express.Router();

CompleteOrderRoute.post("/:id", CreateCompleteOrder);
CompleteOrderRoute.get("/", getCompleteOrder);

module.exports = CompleteOrderRoute;
