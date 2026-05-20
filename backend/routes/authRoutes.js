const express = require("express");
const router = express.Router();
const Tenant = require("../models/Tenant");
const Owner = require("../models/Owner");

// --- TENANT ROUTES ---

router.post("/tenant/signup", async (req, res) => {
  try {
    const existing = await Tenant.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const tenant = new Tenant(req.body);
    await tenant.save();
    res.json({ message: "Tenant registered successfully", tenant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/tenant/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const tenant = await Tenant.findOne({ email });
    if (!tenant) return res.status(404).json({ message: "No account found with this email" });
    if (tenant.password !== password) return res.status(401).json({ message: "Invalid password" });
    if (tenant.isBlocked) return res.status(403).json({ message: "Your account has been blocked by the administrator" });
    res.json({ message: "Login successful", tenant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/tenant/:id", async (req, res) => {
  try {
    const updated = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/tenants", async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- OWNER ROUTES ---

router.post("/owner/signup", async (req, res) => {
  try {
    const existing = await Owner.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const owner = new Owner(req.body);
    await owner.save();
    res.json({ message: "Owner registered successfully", owner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/owner/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await Owner.findOne({ email });
    if (!owner) return res.status(404).json({ message: "No account found with this email" });
    if (owner.password !== password) return res.status(401).json({ message: "Invalid email or password" });
    if (owner.isBlocked) return res.status(403).json({ message: "Your account has been blocked by the administrator" });
    res.json({ message: "Login successful", owner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/owner/:id", async (req, res) => {
  try {
    const updated = await Owner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/owners", async (req, res) => {
  try {
    const owners = await Owner.find();
    res.json(owners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
