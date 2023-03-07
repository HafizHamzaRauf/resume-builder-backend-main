const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  location: { type: String },
  jobs: [
    {
      position: { type: String },
      company: { type: String },
      location: { type: String },
      status: { type: String },
      jobType: { type: String },
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
