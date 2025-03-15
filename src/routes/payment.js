const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, email } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType],
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        email,
        membershipType: membershipType,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      amount: order.amount,
      orderId: order.id,
      currency: order.currency,
      notes: order.notes,
      receipt: order.receipt,
      status: order.status,
    });
    console.log(payment);
    const savedPayment = await payment.save();

    // return order to frontend

    res.json(savedPayment);
  } catch (error) {
    console.log("Error", error);
  }
});

module.exports = paymentRouter;
