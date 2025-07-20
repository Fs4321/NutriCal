const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [{
    ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" },
    quantity: Number,
  }],
  servings: Number,
  totalCalories: Number,
  caloriesPerServing: Number,
  totalProtein: Number,
  totalCarbs: Number,
  totalFat: Number,
  proteinPerServing: Number,
  carbsPerServing: Number,
  fatPerServing: Number,

  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Recipe", RecipeSchema);
