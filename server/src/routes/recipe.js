const express = require("express");
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");

const validateAuthentication = require("../middleware/validateAuthentication");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams"); 
const adminAccess = require("../middleware/adminAccess");
const router = express.Router();


router.use(validateAuthentication);

// Routes
router.post("/", createRecipe);
router.get("/", validatePaginateQueryParams, getAllRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

module.exports = router;
