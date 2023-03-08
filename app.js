const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");

const cors = require("cors");
require("./config/db");
const app = express();

/***************  AUTHENTICATION ROUTES ****************/
const jobRoutes = require("./routes/jobs");
const authRoutes = require("./routes/auth");
// *************   REQUEST  PARSING MIDDLEWARE ****************//
app.use(cors());
app.use(bodyParser.json());

//**************    MAIN MIDDLEWARES **********************/
app.use("/jobs", jobRoutes);
app.use("/auth", authRoutes);
app.use("/", (req, res, next) => {
  console.log("jobify is running");
  return res.status(200).json({ message: "jobify is running" });
});
// Listen on enviroment variable PORT or 3000
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
