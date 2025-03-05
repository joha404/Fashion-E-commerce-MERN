const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: String,
  discription: String,
});

module.exports = mongoose.model("category", categorySchema);
