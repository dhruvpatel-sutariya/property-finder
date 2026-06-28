const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");

const propertyRoutes = require("./routes/propertyRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const chatRoutes = require("./routes/chatRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// JWT Middleware
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, access denied" });
  }
  try {
    const token = authHeader.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

app.use("/api", authRoutes);
app.use("/api", protect, propertyRoutes);
app.use("/api", protect, bookingRoutes);
app.use("/api", protect, chatRoutes);
app.use("/api", protect, reviewRoutes);

app.get("/test", (req, res) => {
  res.json({ status: mongoose.connection.readyState });
});

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});