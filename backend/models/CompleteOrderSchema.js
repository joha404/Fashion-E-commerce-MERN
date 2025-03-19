const mongoose = require("mongoose");

const CompleteOrderSchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("completeOrder", CompleteOrderSchema);
