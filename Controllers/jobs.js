const jwt = require("jsonwebtoken");
const User = require("../models/User");
exports.addJob = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!user) {
      return res.status(400).json({ ok: false, message: "invalid token" });
    }
    const { email, userId } = user;
    console.log(user);
    const loadedUser = await User.findOne({ email, _id: userId }).exec();
    if (!loadedUser) {
      return res
        .status(400)
        .json({ ok: false, message: "User does not exist " });
    }
    const { jobs } = req.body;
    loadedUser.jobs.push(jobs);
    await loadedUser.save();
    return res
      .status(200)
      .json({ ok: true, message: "successfully added the job" });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "something went wrong" });
  }
};
