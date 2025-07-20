const express= require("express");
const { registerUser, loginUser, currentUser, updateUser,deleteUser,getAllUsers } = require("../controllers/userController");
const validateAuthentication = require("../middleware/validateAuthentication");
const adminAccess = require("../middleware/adminAccess");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");
const router = express.Router();

router.post ("/register", registerUser);
router.post ("/login", loginUser);
router.get ("/current", validateAuthentication, currentUser);
router.get ("/", validateAuthentication,adminAccess,validatePaginateQueryParams, getAllUsers);
router.put("/:id", validateAuthentication, updateUser);
router.delete("/:id", validateAuthentication, deleteUser);


module.exports = router;