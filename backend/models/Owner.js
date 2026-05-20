const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  occupation: String,
  address: String,
  profileImage: String,
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Owner", ownerSchema);
