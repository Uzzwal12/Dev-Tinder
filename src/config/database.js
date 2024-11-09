const mongoose = require("mongoose");

const URI = "";

async function connectDB() {
  await mongoose.connect(URI);
}

module.exports = connectDB;
