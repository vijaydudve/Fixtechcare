
const mongoose = require("mongoose");

const connecttodb = async () => {
  try {
    await mongoose.connect("mongodb+srv://demo:demo1234@cluster0.yc0cf0b.mongodb.net/");
    console.log("MongoDB connected!!");
  } catch (error) {
    console.log("Failed to connect to MongoDB", error);
  }
};

module.exports = connecttodb;