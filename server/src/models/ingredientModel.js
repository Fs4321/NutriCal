const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantityInStock: Number,
  unit: String,
  caloriesPer100g: Number,  
  proteinPer100g: Number,   
  fatPer100g: Number,       
  carbsPer100g: Number,
}, { timestamps: true });

module.exports = mongoose.model("Ingredient", IngredientSchema);
