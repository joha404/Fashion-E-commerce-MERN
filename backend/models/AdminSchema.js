const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({
  username: String,
  password: String,
  phone: String,
  reg: String,
  email: String,
});

module.exports = mongoose.model("admin", AdminSchema);
