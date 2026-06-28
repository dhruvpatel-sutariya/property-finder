const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// Tenant booking create કરે
router.post("/bookings", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ message: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Owner ના bookings લાવવા
router.get("/bookings/owner/:ownerId", async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerId: req.params.ownerId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tenant ના bookings લાવવા
router.get("/bookings/tenant/:tenantId", async (req, res) => {
  try {
    const bookings = await Booking.find({ tenantId: req.params.tenantId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin - બધા bookings
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Booking status update (approve/reject)
router.put("/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking updated", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Booking delete
router.delete("/bookings/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
