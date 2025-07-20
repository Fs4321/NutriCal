const express = require("express");
const {
  createMealLog,
  getAllMealLogs,
  getMealLogById,
  updateMealLog,
  deleteMealLog,
} = require("../controllers/meallogController");

const validateAuthentication = require("../middleware/validateAuthentication");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams"); 

const router = express.Router();


router.use(validateAuthentication);

// Routes
router.post("/", createMealLog);
router.get("/", validatePaginateQueryParams, getAllMealLogs); 
router.get("/:id", getMealLogById);
router.put("/:id", updateMealLog);
router.delete("/:id", deleteMealLog);

module.exports = router;
