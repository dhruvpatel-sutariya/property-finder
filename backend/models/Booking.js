const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
  ownerId:  { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
  propertyTitle: String,
  propertyLoc: String,
  propertyImage: String,
  tenantProfile: Object,
  ownerName: String,
  status: { type: String, default: "Pending Owner" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
