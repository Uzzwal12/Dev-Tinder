const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

// POST: Send connection request
requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  res.send(`${user.firstName} sent the connection request`);
});

module.exports = requestRouter;
