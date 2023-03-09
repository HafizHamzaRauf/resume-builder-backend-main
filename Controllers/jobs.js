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
    const loadedUser = await User.findOne({ email, _id: userId }).exec();
    if (!loadedUser) {
      return res
        .status(400)
        .json({ ok: false, message: "User does not exist " });
    }
    const { jobs } = req.body;
    loadedUser.jobs.push(jobs);
    await loadedUser.save();
    return res.status(200).json({
      ok: true,
      message: "successfully added the job",
      jobId: loadedUser.jobs[loadedUser.jobs.length - 1]._id,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "something went wrong" });
  }
};

exports.delete = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // verify  token
    const user = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!user) {
      return res.status(400).json({ ok: false, message: "invalid token" });
    }

    const { email, userId } = user;

    const loadedUser = await User.findOne({ email, _id: userId });
    if (!loadedUser) {
      return res.status(400).json({ ok: false, message: "User not found" });
    }

    const { jobId } = req.body;
    const isFound = loadedUser.jobs.find(
      (item) => item._id.toString() === jobId
    );
    if (!isFound) {
      return res.status(400).json({ ok: false, message: "job not found " });
    }

    const newJobs = loadedUser.jobs.filter((item) => {
      return item._id.toString() !== jobId;
    });

    loadedUser.jobs = newJobs;
    await loadedUser.save();
    return res
      .status(200)
      .json({ ok: true, message: "job deleted Successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ ok: false, message: "something went wrong" });
  }
};
