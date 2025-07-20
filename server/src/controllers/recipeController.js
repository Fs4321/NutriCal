const Recipe = require("../models/recipeModel");
const User = require("../models/userModel");
const Ingredient = require("../models/ingredientModel");
const asyncHandler = require("express-async-handler");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks"); 

const getAdminIds = async () => {
  const admins = await User.find({ is_admin: true }).select("_id");
  return admins.map((admin) => admin._id);
};
 //Create a new recipe

const createRecipe = asyncHandler(async (req, res) => {
  const { name, ingredients, servings } = req.body;

  if (!name || !servings || !Array.isArray(ingredients) || ingredients.length === 0) {
    res.status(400);
    throw new Error("All fields are mandatory and ingredients must be an array.");
  }

  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;
  for (const item of ingredients) {
    const ingredientData = await Ingredient.findById(item.ingredientId);
    if (!ingredientData) {
      res.status(400);
      throw new Error(`Ingredient with ID ${item.ingredientId} not found.`);
    }
    const quantity = item.quantity;
    totalCalories += (ingredientData.caloriesPer100g * quantity) / 100;
    totalProtein  += (ingredientData.proteinPer100g * quantity) / 100;
    totalFat      += (ingredientData.fatPer100g * quantity) / 100;
    totalCarbs    += (ingredientData.carbsPer100g * quantity) / 100;
  }

  const caloriesPerServing = totalCalories / servings;
  const proteinPerServing  = totalProtein / servings;
  const fatPerServing      = totalFat / servings;
  const carbsPerServing    = totalCarbs / servings;

  const newRecipe = await Recipe.create({
    name,
    servings,
    ingredients,
    totalCalories,
    caloriesPerServing,
    totalProtein,
    totalFat,
    totalCarbs,
    proteinPerServing,
    fatPerServing,
    carbsPerServing,
    created_by: req.user.id,
  });

  res.status(201).json(newRecipe);
});


 //Get all recipes with pagination + search

const getAllRecipes = asyncHandler(async (req, res) => {
  const { page, limit } = req.paginate; 
  const { search = "" } = req.query;

  const query = {
    name: { $regex: search, $options: "i" },
    ...(req.user.is_admin
      ? {}
      : {
          $or: [
            { created_by: req.user.id },
            { created_by: { $in: await getAdminIds() } },
          ],
        }),
  };
  

  const recipes = await Recipe.find(query)
    .populate("ingredients.ingredientId", "name")
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Recipe.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res
    .status(200)
    .links(generatePaginationLinks(req.originalUrl, page, totalPages, limit))
    .json({
      totalItems: total,
      totalPages,
      currentPage: page,
      recipes,
    });
});

/**
 * Get recipe by ID
 */
const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate("ingredients.ingredientId", "name");
  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }
  res.status(200).json(recipe);
});

/**
 * Update a recipe
 */
const updateRecipe = asyncHandler(async (req, res) => {
  const { name, servings, ingredients } = req.body;

  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }
  if (!req.user.is_admin && recipe.created_by.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to update this recipe");
  }

  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;
  for (const item of ingredients) {
    const ingredientData = await Ingredient.findById(item.ingredientId);
    if (!ingredientData) {
      res.status(400);
      throw new Error(`Ingredient with ID ${item.ingredientId} not found.`);
    }
    const qty = item.quantity;

    totalCalories += (ingredientData.caloriesPer100g * qty) / 100;
    totalProtein  += (ingredientData.proteinPer100g * qty) / 100;
    totalFat      += (ingredientData.fatPer100g * qty) / 100;
    totalCarbs    += (ingredientData.carbsPer100g * qty) / 100;
  }

  const caloriesPerServing = totalCalories / servings;
  const proteinPerServing = totalProtein / servings;
  const fatPerServing = totalFat / servings;
  const carbsPerServing = totalCarbs / servings;

  recipe.name = name || recipe.name;
  recipe.servings = servings || recipe.servings;
  recipe.ingredients = ingredients || recipe.ingredients;
  recipe.totalCalories = totalCalories;
  recipe.caloriesPerServing = caloriesPerServing;
  recipe.totalProtein = totalProtein;
  recipe.totalFat = totalFat;
  recipe.totalCarbs = totalCarbs;
  recipe.proteinPerServing = proteinPerServing;
  recipe.fatPerServing = fatPerServing;
  recipe.carbsPerServing = carbsPerServing;

  const updated = await recipe.save();
  res.status(200).json(updated);
});


 //Delete a recipe
 
const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }

  if (!req.user.is_admin && recipe.created_by.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to delete this recipe");
  }

  await recipe.deleteOne();
  res.status(200).json({ message: "Recipe deleted successfully" });
});

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
};
