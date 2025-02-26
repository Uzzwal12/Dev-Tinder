const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { handleError } = require("../utils/errorUtils");
const { validateProfileData } = require("../utils/validation");

const profileRouter = express.Router();

// GET: Profile
profileRouter.get("/profile/view", userAuth, (req, res) => {
  res.send(req.user);
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.status(200).send("Profile updated successfully");
  } catch (error) {
    handleError(res, `Error saving user: ${error.message}`);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const isValidPassword = await loggedInUser.validatePassword(
      req.body.currentPassword
    );
    if (req.body.currentPassword === req.body.newPassword) {
      throw new Error("New password cannot be same as your old password");
    }
    if (!isValidPassword) {
      throw new Error("Invalid current password");
    }
    loggedInUser.password = req.body.newPassword;
    await loggedInUser.save();
    res
      .status(200)
      .send(
        `Hello ${loggedInUser.firstName} your password has been updated successfully`
      );
  } catch (error) {
    handleError(res, `Something went wrong: ${error.message}`);
  }
});

module.exports = profileRouter;
