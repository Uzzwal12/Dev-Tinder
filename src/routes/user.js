const express = require("express");

const { handleError } = require("../utils/errorUtils");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const userRouter = express.Router();

const SAFE_DATA = "firstName lastName age about gender photoUrl";

// Get all the pending connection requests for loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_DATA);
    res.status(200).send(pendingRequests);
  } catch (error) {
    handleError(handleError(res, `Something went wrong: ${error.message}`));
  }
});

// Get all the connections for loggedIn user
userRouter.get("/user/connections/", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_DATA)
      .populate("toUserId", SAFE_DATA);

    const data = connections.map((item) =>
      item.fromUserId._id.toString() === loggedInUser._id.toString()
        ? item.toUserId
        : item.fromUserId
    );
    res.status(200).send(data);
  } catch (error) {
    handleError(handleError(res, `Something went wrong: ${error.message}`));
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit =
      (parseInt(req.query.limit) > 50 ? 50 : parseInt(req.query.limit)) || 4;
    const skip = (page - 1) * limit;
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connections.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString()),
        hideUsersFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideUsersFromFeed) },
        },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.send(users);
  } catch (error) {
    handleError(handleError(res, `Something went wrong: ${error.message}`));
  }
});

module.exports = userRouter;
