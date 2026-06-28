const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: String,
  sender: { type: String, enum: ["user", "owner"] },
  time: String,
  type: String,
  propertyData: Object,
  ratingData: Object
});

const chatSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
  ownerId:  { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
  messages: [messageSchema]
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
