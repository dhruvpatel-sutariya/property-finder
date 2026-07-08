const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: String,
  city: String,
  type: String,
  listingType: String,
  price: Number,
  image: String,
  images: [String],
  description: String,
  address: String,
  bedrooms: Number,
  ownerEmail: String,
  ownerName: String,
  ownerId: String,
  approvalStatus: { type: String, default: 'pending' },
  isApproved: { type: Boolean, default: false }
});

module.exports = mongoose.model("Property", propertySchema);