const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    age: req.body.age,
    gender: req.body.gender,
  });

  try {
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(`Error saving user: ${error.message}`);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const users = await User.find({ email: userEmail });
    if (users.length === 0) {
      res.status(404).send(`No user found with this email : ${userEmail}`);
    }

    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(`Something went wrong : ${error}`);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.status(200).send("User deleted");
  } catch (error) {
    res.status(400).send("Something went wrong while deleting user");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      res.status(404).send(`No user found with this email`);
    }

    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(`Something went wrong : ${error}`);
  }
});

app.patch("/user/:id", async (req, res) => {
  const updatedData = req.body;
  const userId = req.params.id;
  try {
    await User.findByIdAndUpdate(userId, updatedData, { runValidators: true });
    res.status(200).send(`User updated`);
  } catch (error) {
    res
      .status(400)
      .send(`Something went wrong while updating user: ${error.message}`);
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
