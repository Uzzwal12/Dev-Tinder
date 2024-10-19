const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: 1,
    lastName: "Gupta",
    email: "uzzwal@gmail.com",
    password: "uzzwal1212",
  });

  try {
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send("Error saving user", error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connection Successful");
    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  })
  .catch((err) => console.log(err, "Database cannot be connected"));
