const mongoose = require("mongoose");

const dbURL = process.env.MONGO_URL;

async function DBConnect() {
  try {
    await mongoose.connect(dbURL);
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

module.exports = DBConnect;
