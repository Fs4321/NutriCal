const mongoose = require("mongoose");

const MealBoxSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  description: { type: String },
  stockAvailable: { type: Number, required: true },
  price: { type: Number }, // optional
}, { timestamps: true });

module.exports = mongoose.model("MealBox", MealBoxSchema);
