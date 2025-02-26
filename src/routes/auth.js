const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { handleError } = require("../utils/errorUtils");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, age, gender } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      gender,
    });
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    handleError(res, `Error saving user: ${error.message}`);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return handleError(res, "Invalid email", 401);

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) return handleError(res, "Invalid password", 401);

    const token = await user.getJwt();
    res.cookie("token", token);
    res.status(200).send("Logged in successfully");
  } catch (error) {
    handleError(res, `Login failed: ${error.message}`);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logged out successfully");
});

module.exports = authRouter;
