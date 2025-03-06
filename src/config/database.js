const mongoose = require("mongoose");

const URI =
  "mongodb+srv://NamasteNode:bQEj1GDyHT0sSnU8@nodejs.me4zx.mongodb.net/DevTinder";

async function connectDB() {
  await mongoose.connect(URI);
}

module.exports = connectDB;
