const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

require("./utils/cronJob");

const cors = require("cors");
const paymentRouter = require("./routes/payment");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

// Connect to the database and start the server
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(process.env.PORT, () =>
      console.log("Server running on port 3000")
    );
  })
  .catch((err) => console.log("Database connection error:", err));
