const express = require("express");
const router = express.Router();
const JobController = require("../Controllers/jobs");
router.post("/add", JobController.addJob);
router.post("/delete", JobController.delete);
module.exports = router;
