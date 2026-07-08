const express = require("express");
const router = express.Router();
const Property = require("../models_property");

router.get("/properties", async (req, res) => {
  try {
    const filter = {};
    if (req.query.city) filter.city = { $regex: req.query.city, $options: 'i' };
    if (req.query.type) filter.type = { $regex: req.query.type, $options: 'i' };
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { city: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.ownerEmail) filter.ownerEmail = req.query.ownerEmail;
    if (req.query.ownerId) filter.ownerId = req.query.ownerId;
    const properties = await Property.find(filter);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/properties", async (req, res) => {
  try {
    const property = new Property(req.body);
    const savedProperty = await property.save();
    res.json({
      message: "Property added successfully",
      property: savedProperty
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/properties/:id", async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json({
      message: "Property updated successfully",
      property: updatedProperty
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/properties/:id", async (req, res) => {
  try {
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);
    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;