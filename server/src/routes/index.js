const express = require("express");

const IngredientRouter = require("./ingredient");
const UserRouter = require("./user");
const RecipeRouter = require("./recipe");
const MealLogRouter = require("./meallog");
const MealBoxRouter = require("./mealbox");

const router = express.Router();

router.use('/ingredient', IngredientRouter);
router.use('/user', UserRouter);
router.use('/recipe', RecipeRouter);
router.use('/meallog', MealLogRouter);
router.use("/mealbox", MealBoxRouter);

module.exports = router;
