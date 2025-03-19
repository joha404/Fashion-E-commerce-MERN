const mongoose = require("mongoose");

let isConnected = false;

const DBConnect = async () => {
  if (isConnected) {
    console.log("🔄 Using existing database connection");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGOURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
};

module.exports = DBConnect;
