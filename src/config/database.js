const mongoose = require("mongoose");

const URI =
  "mongodb+srv://NamasteNode:zosq55oxZIxJpZnH@nodejs.me4zx.mongodb.net/DevTinder";

async function connectDB() {
  await mongoose.connect(URI);
}

module.exports = connectDB;
