const asyncHandler = require("express-async-handler");
const Ingredient = require("../models/ingredientModel");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

// GET all ingredients with pagination and search
const getAllIngredients = asyncHandler(async (req, res) => {
  const { page, limit } = req.paginate;
  const { search = "" } = req.query;
  const sortBy = req.query.sortBy || "name"; // default sort
  const order = req.query.order === "desc" ? -1 : 1;

  const query = {
    name: { $regex: search, $options: "i" },
  };

  const ingredients = await Ingredient.find(query)
    .sort({ [sortBy]: order })
    .skip((page - 1) * limit)
    .limit(limit);
    
    

  const total = await Ingredient.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res
    .status(200)
    .links(generatePaginationLinks(req.originalUrl, page, totalPages, limit)) 
    .json({
      totalItems: total,
      totalPages,
      currentPage: page,
      ingredients,
    });
});


// GET ingredient by ID
const getIngredientById = asyncHandler(async (req, res) => {
  const ingredient = await Ingredient.findById(req.params.id);
  if (!ingredient) {
    res.status(404);
    throw new Error("Ingredient not found");
  }
  res.status(200).json(ingredient);
});

// CREATE ingredient
const createIngredient = asyncHandler(async (req, res) => {
  const { name, quantityInStock, unit, caloriesPer100g, proteinPer100g, fatPer100g, carbsPer100g } = req.body;
  const ingredient = new Ingredient({
    name,
    quantityInStock,
    unit,
    caloriesPer100g,
    proteinPer100g,
    fatPer100g,
    carbsPer100g,
    
  });
  const created = await ingredient.save();
  res.status(201).json(created);
});

// UPDATE ingredient
const updateIngredient = asyncHandler(async (req, res) => {
  const updated = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) {
    res.status(404);
    throw new Error("Ingredient not found");
  }
  res.status(200).json(updated);
});

// DELETE ingredient
const deleteIngredient = asyncHandler(async (req, res) => {
  if (!req.user.is_admin) {
    res.status(403);
    throw new Error("You are not authorized. Admin access only!");
  }

  const deleted = await Ingredient.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404);
    throw new Error("Ingredient not found");
  }

  res.status(200).json({ message: "Ingredient deleted successfully" });
});


module.exports = {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
};
