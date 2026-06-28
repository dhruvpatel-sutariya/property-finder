const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

// Chat fetch કરો (tenant + owner વચ્ચે)
router.get("/chat/:tenantId/:ownerId", async (req, res) => {
  try {
    let chat = await Chat.findOne({ tenantId: req.params.tenantId, ownerId: req.params.ownerId });
    if (!chat) chat = await Chat.create({ tenantId: req.params.tenantId, ownerId: req.params.ownerId, messages: [] });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Message send કરો
router.post("/chat/:tenantId/:ownerId/message", async (req, res) => {
  try {
    let chat = await Chat.findOne({ tenantId: req.params.tenantId, ownerId: req.params.ownerId });
    if (!chat) chat = await Chat.create({ tenantId: req.params.tenantId, ownerId: req.params.ownerId, messages: [] });

    chat.messages.push(req.body);
    await chat.save();
    res.json({ message: "Message sent", chat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Owner ના બધા chats
router.get("/chats/owner/:ownerId", async (req, res) => {
  try {
    const chats = await Chat.find({ ownerId: req.params.ownerId }).populate("tenantId", "name email avatar");
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tenant ના બધા chats
router.get("/chats/tenant/:tenantId", async (req, res) => {
  try {
    const chats = await Chat.find({ tenantId: req.params.tenantId }).populate("ownerId", "name email profileImage");
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
