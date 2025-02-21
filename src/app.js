const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashPassword,
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

app.post("/login", async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email");
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid Password");
  } else {
    res.status(200).send("Logged in successfully");
  }
  try {
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

app.patch("/user/:userId", async (req, res) => {
  const updatedData = req.body;
  const userId = req.params.userId;

  try {
    const ALLOWED_CHANGES = ["photoUrl", "about", "skills", "password"];
    const isUpdateAllowed = Object.keys(updatedData).every((key) =>
      ALLOWED_CHANGES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error(`some fields are not allowed`);
    }
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
