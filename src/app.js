const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Helper function to handle errors
const handleError = (res, message, status = 400) => {
  res.status(status).send(message);
};

// POST: Sign up
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, age, gender } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      age,
      gender,
    });

    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    handleError(res, `Error saving user: ${error.message}`);
  }
});

// POST: Login
app.post("/login", async (req, res) => {
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

// GET: Profile
app.get("/profile", userAuth, (req, res) => {
  res.send(req.user);
});

// POST: Send connection request
app.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  res.send(`${user.firstName} sent the connection request`);
});

// Connect to the database and start the server
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => console.log("Database connection error:", err));
