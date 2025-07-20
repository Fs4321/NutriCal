const mongoose = require("mongoose");

const MealLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, required: true },
  mealType: { type: String, required: true },
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  totalCalories: Number
}, { timestamps: true });

module.exports = mongoose.model("Meallog", MealLogSchema);
