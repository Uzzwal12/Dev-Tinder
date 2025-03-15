const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZOR_KEY_ID,
  key_secret: process.env.RAZOR_SECRET_KEY,
});

module.exports = razorpayInstance;
