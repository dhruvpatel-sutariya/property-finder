const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://dhruv:Dhruv1234@cluster0.gbsuiaq.mongodb.net/propertyDB?retryWrites=true&w=majority", {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      family: 4
    });
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
