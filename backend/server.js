const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const propertyRoutes = require("./routes/propertyRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use("/api", propertyRoutes);
app.use("/api", authRoutes);

app.get("/test", (req, res) => {
  res.json({ status: mongoose.connection.readyState });
});

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});