const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// Review add કરો
router.post("/reviews", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.json({ message: "Review submitted", review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Property ના reviews
router.get("/reviews/:propertyId", async (req, res) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.propertyId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin - બધા reviews
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Review delete
router.delete("/reviews/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Review flag
router.put("/reviews/:id/flag", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isFlagged: true }, { new: true });
    res.json({ message: "Review flagged", review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
