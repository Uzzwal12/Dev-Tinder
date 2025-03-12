const mongoose = require("mongoose");

const URI = process.env.DB_CONNECTION;

async function connectDB() {
  await mongoose.connect(URI);
}

module.exports = connectDB;
