const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email:" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 15,
    },
    gender: {
      type: String,
      required: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value.toLowerCase())) {
          throw new Error("Invalid Gender Provided");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL format");
        }
      },
    },
    about: {
      type: String,
      default: "Default about of user",
      validate(value) {
        if (value.length > 200) {
          throw new Error("About section must be 200 characters or less");
        }
      },
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length >= 5) {
          throw new Error("Cannot add more than 4 skills");
        }
        if (value.some((skill) => skill.length < 2)) {
          throw new Error("Each skill must be at least 2 characters long");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Dev@Tinder$12", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const isValidPassword = await bcrypt.compare(password, user.password);

  return isValidPassword;
};

userSchema.pre("save", async function (next) {
  const user = this; // 'this' refers to the current user document

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  // Proceed with the save operation
  next();
});

module.exports = mongoose.model("User", userSchema);
