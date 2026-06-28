const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
  tenantName: String,
  propertyId: String,
  propertyTitle: String,
  stars: { type: Number, min: 1, max: 5 },
  comments: String,
  isFlagged: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
