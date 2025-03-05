const express = require("express");
const addressRouter = express.Router();
const addressController = require("../controllers/addressController");

// Create an address
addressRouter.post("/create", addressController.createAddress);

// Get all addresses for a user
addressRouter.get("/user/:userId", addressController.getUserAddresses);

// Get a single address by ID
addressRouter.get("/:id", addressController.getAddressById);

// Update an address
addressRouter.put("/update/:id", addressController.updateAddress);

// Delete an address
addressRouter.delete("/delete/:id", addressController.deleteAddress);

module.exports = addressRouter;
