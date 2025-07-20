const express = require("express");
const { 
  getAllMealBoxes,
  getMealBoxById,
  createMealBox,
  updateMealBox,
  deleteMealBox,
  orderMealBox,
  requestRestockMealBox,
} = require("../controllers/mealboxController");

const validateAuthentication = require("../middleware/validateAuthentication");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");
const adminAccess = require("../middleware/adminAccess");
const router = express.Router();

router.get("/", validatePaginateQueryParams, getAllMealBoxes);

router.get("/:id", getMealBoxById);
router.post("/create", validateAuthentication,adminAccess, createMealBox); 
router.put("/:id", validateAuthentication,adminAccess, updateMealBox);
router.delete("/:id", validateAuthentication, adminAccess, deleteMealBox);

// Special routes
router.patch("/order/:id", validateAuthentication, orderMealBox);
router.patch("/request/:id", validateAuthentication, requestRestockMealBox);

module.exports = router;
