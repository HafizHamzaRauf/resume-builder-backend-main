const express = require("express");
const router = express.Router();
const JobController = require("../Controllers/jobs");
router.post("/add", JobController.addJob);

module.exports = router;
