const MealLog = require("../models/mealLogModel");
const Recipe = require("../models/recipeModel");
const asyncHandler = require("express-async-handler");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");


// CREATE MealLog with automatic calorie calculation
const createMealLog = asyncHandler(async (req, res) => {
  const { mealType, recipeIds } = req.body;
  const date = new Date().toISOString().split("T")[0];
  const userId = req.user.id;

  console.log("Incoming MealLog request body:", req.body);
  console.log("Logged in user ID:", req.user.id);
  



  // Fetch recipes from DB
  const recipes = await Recipe.find({ _id: { $in: recipeIds } });

  if (!recipes.length) {
    res.status(400);
    throw new Error("No valid recipes found.");
  }

  // Calculate total calories
  const totalCalories = recipes
    .filter(recipe => recipe.caloriesPerServing !== undefined)
    .reduce((sum, recipe) => sum + recipe.caloriesPerServing, 0);

  // Create MealLog entry
  const newMealLog = await MealLog.create({
    userId,
    date,

    mealType,
    recipes: recipes.map((r) => r._id),
    totalCalories,
  });

  console.log("MealLog saved to DB:", newMealLog);

  res.status(201).json(newMealLog);
});

// GET all MealLogs for current user (with pagination and filtering)
const getAllMealLogs = asyncHandler(async (req, res) => {
  const { page, limit } = req.paginate; 
  const { mealType = "" } = req.query;

  const query = {
    userId: req.user.id,
  };
  
  if (mealType) {
    query.mealType = { $regex: mealType, $options: "i" };
  }
  

  const logs = await MealLog.find(query, "mealType date recipes totalCalories")
    .populate("recipes", "name caloriesPerServing proteinPerServing fatPerServing carbsPerServing")

    .populate("userId", "first_name email_id")
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await MealLog.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res
    .status(200)
    .links(generatePaginationLinks(req.originalUrl, page, totalPages, limit)) 
    .json({
      totalItems: total,
      totalPages,
      currentPage: page,
      logs,
    });
    console.log("getAllMealLogs called. Returning logs:", logs.length);
});

// GET MealLog by ID
const getMealLogById = asyncHandler(async (req, res) => {
  const log = await MealLog.findById(req.params.id)
    .populate("recipes")
    .populate("userId", "first_name email_id");
  
  if (!log) {
    res.status(404);
    throw new Error("MealLog not found");
  }

  //restrict access — only user himself can view
  if (log.userId._id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Unauthorized to view this meal log");
  }

  res.status(200).json(log);
});

// UPDATE MealLog
const updateMealLog = asyncHandler(async (req, res) => {
  const log = await MealLog.findById(req.params.id);
  if (!log) {
    res.status(404);
    throw new Error("MealLog not found");
  }

  if (log.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Unauthorized to update this meal log");
  }

  const updatedLog = await MealLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedLog);
});

// DELETE MealLog
const deleteMealLog = asyncHandler(async (req, res) => {
  const log = await MealLog.findById(req.params.id);
  if (!log) {
    res.status(404);
    throw new Error("MealLog not found");
  }

  if (log.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Unauthorized to delete this meal log");
  }

  await MealLog.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "MealLog deleted successfully" });
});

module.exports = {
  createMealLog,
  getAllMealLogs,
  getMealLogById,
  updateMealLog,
  deleteMealLog,
};
