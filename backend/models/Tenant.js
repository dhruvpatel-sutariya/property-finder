const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  occupation: String,
  salary: String,
  dob: String,
  address: String,
  prefLocations: String,
  prefType: String,
  budget: String,
  avatar: String,
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Tenant", tenantSchema);
