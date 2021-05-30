const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// route: POST /api/users/signup
// useage: Register a new user
// auth: public

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  let user = new UserModel({
    email,
    password,
  });
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    const resData = await user.save();
    user = await UserModel.find({ email }).select("-password");
    res.status(201).json({ msg: "New user added", user: resData });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Invalid authentication credentials");
  }
});

// route: POST /api/users/login
// useage: Login user and return token
// auth: public

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).send("Incorrect email or password");
    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) return res.status(401).send("Incorrect email or password");
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, expiresIn: 3600, userId: user._id });
  } catch (error) {
    console.log(error.message);
    res.status(401).send("Invalid authentication credentials");
  }
});

module.exports = router;
