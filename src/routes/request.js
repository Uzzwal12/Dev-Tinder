const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { handleError } = require("../utils/errorUtils");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

// POST: Send connection request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const ALLOWED_STATUS = ["ignored", "interested"];
      if (!ALLOWED_STATUS.includes(status)) {
        return res.status("400").send("Invalid status");
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).send("User not found");
      }
      const existingConnectionRequest = await User.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).send("Connection request already sent");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();
      res.status(200).send("Connection request sent!");
    } catch (error) {
      handleError(res, `Error saving user: ${error.message}`);
    }
  }
);

module.exports = requestRouter;
