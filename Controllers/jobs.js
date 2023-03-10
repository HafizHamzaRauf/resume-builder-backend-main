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
    const user = await jwt.verify(token, process.env.PRIVATE_KEY);
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

exports.editJob = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!user) {
      return res.status(400).json({ ok: false, message: "invalid  token" });
    }
    const { email, userId } = user;

    const loadedUser = await User.findOne({ email, _id: userId });
    if (!loadedUser) {
      return res.status(400).json({ ok: false, message: "user not found " });
    }
    console.log(loadedUser);
    const { job, jobId } = req.body;
    const isFound = loadedUser.jobs.findIndex(
      (item) => item._id.toString() === jobId
    );
    if (isFound === -1) {
      return res.status(400).json({ ok: false, message: "job not found" });
    }
    console.log(loadedUser, loadedUser.jobs[isFound]);
    loadedUser.jobs[isFound] = { ...job, _id: jobId };
    await loadedUser.save();
    return res
      .status(200)
      .json({ ok: true, message: "job edited successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, message: "something went  wrong" });
  }
};

exports.getJobs = async (req, res, next) => {
  try {
    const jobTitles = [
      "Senior Web Developer",
      "UX Designer",
      "Frontend Engineer",
      "Digital Marketing Manager",
      "Product Manager",
      "Full Stack Developer",
      "Data Analyst",
      "Content Strategist",
      "Mobile App Developer",
      "Cloud Solutions Architect",
      "Cybersecurity Specialist",
      "Technical Writer",
      "Social Media Manager",
      "SEO Specialist",
      "DevOps Engineer",
    ];

    const companies = [
      "Acme Corp",
      "Globex",
      "Initech",
      "Umbrella Corporation",
      "Monsters, Inc.",
      "Stark Industries",
      "Wayne Enterprises",
      "Spacely Sprockets",
      "Soylent Corp",
      "Aperture Science",
      "Weyland-Yutani",
      "Hooli",
      "Pied Piper",
      "Gekko & Co",
      "Dunder Mifflin",
    ];

    const locations = [
      "San Francisco",
      "New York",
      "London",
      "Paris",
      "Tokyo",
      "Sydney",
      "Berlin",
      "Seattle",
      "Austin",
      "Chicago",
      "Toronto",
      "Dublin",
      "Amsterdam",
      "Mumbai",
      "Shanghai",
    ];

    const jobTypes = ["full-time", "remote", "internship", "part-time"];

    const jobStatuses = ["pending", "interview", "declined"];

    const jobs = [];

    for (let i = 0; i < 15; i++) {
      const randomTitleIndex = Math.floor(Math.random() * jobTitles.length);
      const randomCompanyIndex = Math.floor(Math.random() * companies.length);
      const randomLocationIndex = Math.floor(Math.random() * locations.length);
      const randomJobTypeIndex = Math.floor(Math.random() * jobTypes.length);
      const randomJobStatusIndex = Math.floor(
        Math.random() * jobStatuses.length
      );

      const job = {
        position: jobTitles[randomTitleIndex],
        company: companies[randomCompanyIndex],
        location: locations[randomLocationIndex],
        status: jobStatuses[randomJobStatusIndex],
        jobType: jobTypes[randomJobTypeIndex],
        date: new Date(),
      };

      jobs.push(job);
    }

    return res.status(200).json({ ok: true, jobs });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "something went wrong" });
  }
};
