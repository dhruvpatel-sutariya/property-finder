const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tenant = require("../models/Tenant");
const Owner = require("../models/Owner");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// --- ADMIN ROUTES ---

router.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || "admin01";
  const adminPass = process.env.ADMIN_PASSWORD || "123456789";
  if (username !== adminUser || password !== adminPass) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
  const token = jwt.sign({ id: "admin", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ message: "Admin login successful", token });
});

// --- FORGOT PASSWORD ---

router.post("/tenant/forgot-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const tenant = await Tenant.findOne({ email });
    if (!tenant) return res.status(404).json({ message: "No account found with this email" });
    const hashed = await bcrypt.hash(newPassword, 10);
    await Tenant.findByIdAndUpdate(tenant._id, { password: hashed });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/owner/forgot-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const owner = await Owner.findOne({ email });
    if (!owner) return res.status(404).json({ message: "No account found with this email" });
    const hashed = await bcrypt.hash(newPassword, 10);
    await Owner.findByIdAndUpdate(owner._id, { password: hashed });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- TENANT ROUTES ---

router.post("/tenant/signup", async (req, res) => {
  try {
    const existing = await Tenant.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const tenant = new Tenant({ ...req.body, password: hashedPassword });
    await tenant.save();
    const token = generateToken(tenant._id, "tenant");
    res.json({ message: "Tenant registered successfully", tenant, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/tenant/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const tenant = await Tenant.findOne({ email });
    if (!tenant) return res.status(404).json({ message: "No account found with this email" });
    const isMatch = await bcrypt.compare(password, tenant.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });
    if (tenant.isBlocked) return res.status(403).json({ message: "Your account has been blocked by the administrator" });
    const token = generateToken(tenant._id, "tenant");
    res.json({ message: "Login successful", tenant, token });
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

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const owner = new Owner({ ...req.body, password: hashedPassword });
    await owner.save();
    const token = generateToken(owner._id, "owner");
    res.json({ message: "Owner registered successfully", owner, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/owner/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await Owner.findOne({ email });
    if (!owner) return res.status(404).json({ message: "No account found with this email" });
    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });
    if (owner.isBlocked) return res.status(403).json({ message: "Your account has been blocked by the administrator" });
    const token = generateToken(owner._id, "owner");
    res.json({ message: "Login successful", owner, token });
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
