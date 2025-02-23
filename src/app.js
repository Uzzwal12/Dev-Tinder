const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

// Connect to the database and start the server
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => console.log("Database connection error:", err));
