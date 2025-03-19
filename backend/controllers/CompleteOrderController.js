const CompleteOrderSchema = require("../models/CompleteOrderSchema");

const CreateCompleteOrder = async (req, res) => {
  const { id } = req.params; // Extract the order ID properly

  try {
    const CreateOrderFinish = await CompleteOrderSchema.create({
      order: id, // Assign order ID properly
    });
    return res.status(201).json({
      success: true,
      message: "Order completed successfully",
      data: CreateOrderFinish,
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
const getCompleteOrder = async (req, res) => {
  try {
    const getCreateOrderFinish = await CompleteOrderSchema.find();
    return res.status(201).json({
      success: true,
      message: "Order completed successfully",
      data: getCreateOrderFinish,
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
  CreateCompleteOrder,
  getCompleteOrder,
};
