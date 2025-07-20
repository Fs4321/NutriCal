const express = require("express");
const router = express.Router();
const {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} = require("../controllers/ingredientController");

const validateAuthentication = require("../middleware/validateAuthentication");
const validateMongoId = require("../middleware/validateMongoId");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");
const adminAccess = require("../middleware/adminAccess");

// Routes
router.get("/", validatePaginateQueryParams, getAllIngredients);
router.get("/:id", validateMongoId("id"), getIngredientById);
router.post("/", validateAuthentication, adminAccess,createIngredient);
router.put("/:id", validateAuthentication,adminAccess, validateMongoId("id"), updateIngredient);
router.delete("/:id", validateAuthentication,adminAccess, validateMongoId("id"), deleteIngredient);

module.exports = router;
