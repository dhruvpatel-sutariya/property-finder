const express = require("express");
const router = express.Router();
const Property = require("../models_property");

router.get("/properties", async (req, res) => {
  try {
    const properties = await Property.find();
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