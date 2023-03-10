const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.signup = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    // VALIDATING WHETHER THE  USER ALREADY EXIST
    const result = await User.findOne({ email: email }).select("email").exec();
    if (result) {
      res.status(422).json({ message: "User already exist", ok: false });
      return;
    }
    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 12);
    //create  new user  in the database
    const user = new User({ username, email, password: hashedPassword });
    // save the user to the database
    await user.save();
    // generate the token
    const token = jwt.sign(
      {
        email,
        userId: user._id.toString(),
      },
      process.env.PRIVATE_KEY,
      {
        expiresIn: "12h",
      }
    );

    // return the  response to user
    return res.status(201).json({
      ok: true,

      message: "User Signed Up Successfully",
      userId: user._id,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", ok: false });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const loadedUser = await User.findOne({ email }).exec();
    if (!loadedUser) {
      res
        .status(422)
        .json({ message: "No User found with this email", ok: false });
      return;
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      loadedUser.password
    );
    if (!isPasswordCorrect) {
      res.status(422).json({ message: "Wrong password", ok: false });
      return;
    }
    const token = jwt.sign(
      {
        email,
        userId: loadedUser._id.toString(),
      },
      process.env.PRIVATE_KEY,
      {
        expiresIn: "12h",
      }
    );
    res.status(200).json({
      token,
      message: "Successfully logged in",
      user_id: loadedUser._id,
      user: loadedUser,
      ok: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "SOmething went wrong", ok: false });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!user) {
      return res.status(400).json({ ok: false, message: "Invalid token" });
    }
    const { email, userId } = user;
    const loadedUser = await User.findOne({ email, userId });
    if (!loadedUser) {
      return res.status(400).json({ ok: false, message: "User not found" });
    }
    const { newEmail, username, location } = req.body;
    loadedUser.email = newEmail;
    loadedUser.username = username;
    loadedUser.location = location;
    await loadedUser.save();
    const newToken = jwt.sign(
      { email: newEmail, userId: loadedUser.userId },
      process.env.PRIVATE_KEY,
      { expiresIn: "12h" }
    );
    return res.status(200).json({
      ok: true,
      message: "User updated successfully",
      token: newToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Something went wrong" });
  }
};
