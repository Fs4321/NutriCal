const asyncHandler = require("express-async-handler");
const MealBox = require("../models/mealBoxModel");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

// GET all MealBoxes with pagination and search
const getAllMealBoxes = asyncHandler(async (req, res) => {
  const { page, limit } = req.paginate;   
  const { search = "" } = req.query;     
  const sortBy = req.query.sortBy || "name"; // default sort
  const order = req.query.order === "desc" ? -1 : 1;  

  const query = {
    name: { $regex: search, $options: "i" },  
  };

  const mealBoxes = await MealBox.find(query)
    
    .sort({ [sortBy]: order })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await MealBox.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res
    .status(200)
    .links(generatePaginationLinks(req.originalUrl, page, totalPages, limit)) 
    .json({
      totalItems: total,
      totalPages,
      currentPage: page,
      mealBoxes,
    });
});

// GET MealBox by ID
const getMealBoxById = asyncHandler(async (req, res) => {
  const mealBox = await MealBox.findById(req.params.id);
  if (!mealBox) {
    res.status(404);
    throw new Error("MealBox not found");
  }
  res.status(200).json(mealBox);
});

// CREATE a MealBox
const createMealBox = asyncHandler(async (req, res) => {
  const { name, calories, description, stockAvailable, price } = req.body;

  const mealBox = new MealBox({
    name,
    calories,
    description,
    stockAvailable,
    price,
  });

  const created = await mealBox.save();
  res.status(201).json(created);
});

// UPDATE MealBox
const updateMealBox = asyncHandler(async (req, res) => {
  const updated = await MealBox.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) {
    res.status(404);
    throw new Error("MealBox not found");
  }
  res.status(200).json(updated);
});

// DELETE MealBox
const deleteMealBox = asyncHandler(async (req, res) => {
  const deleted = await MealBox.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404);
    throw new Error("MealBox not found");
  }
  res.status(200).json({ message: "MealBox deleted successfully" });
});

// ORDER MealBox (decrease stock)
const orderMealBox = asyncHandler(async (req, res) => {
  const { quantity } = req.body; 
  const mealBox = await MealBox.findById(req.params.id);

  if (!mealBox) {
    res.status(404);
    throw new Error("MealBox not found");
  }

  if (mealBox.stockAvailable < quantity) {
    res.status(400);
    throw new Error("Not enough stock available");
  }

  mealBox.stockAvailable -= quantity;
  await mealBox.save();

  res.status(200).json({ message: "Order placed successfully", updatedMealBox: mealBox });
});

// REQUEST Restock MealBox
const requestRestockMealBox = asyncHandler(async (req, res) => {
  const mealBox = await MealBox.findById(req.params.id);
  if (!mealBox) {
    res.status(404);
    throw new Error("MealBox not found");
  }

  mealBox.stockAvailable += 10; 
  await mealBox.save();

  res.status(200).json({ message: "Restock request successful", updatedMealBox: mealBox });
});

module.exports = {
  getAllMealBoxes,
  getMealBoxById,
  createMealBox,
  updateMealBox,
  deleteMealBox,
  orderMealBox,
  requestRestockMealBox,
};
