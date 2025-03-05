const Address = require("../models/addressSchema");

// Create a new address
exports.createAddress = async (req, res) => {
  try {
    const {
      user,
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    if (
      !user ||
      !fullName ||
      !phone ||
      !street ||
      !city ||
      !state ||
      !postalCode ||
      !country
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isDefault) {
      await Address.updateMany({ user }, { isDefault: false }); // Ensure only one default address
    }

    const address = new Address({
      user,
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
    });
    await address.save();

    res.status(201).json({ message: "Address added successfully", address });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding address", error: error.message });
  }
};

// Get all addresses for a user
exports.getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.params.userId });
    res.status(200).json(addresses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching addresses", error: error.message });
  }
};

// Get a single address by ID
exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json(address);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching address", error: error.message });
  }
};

// Update an address
exports.updateAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.body.user }, { isDefault: false }); // Ensure only one default
    }

    const address = await Address.findByIdAndUpdate(
      req.params.id,
      { fullName, phone, street, city, state, postalCode, country, isDefault },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address updated successfully", address });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating address", error: error.message });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting address", error: error.message });
  }
};
