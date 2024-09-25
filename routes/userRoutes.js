const router = require("express").Router();
const userController = require("../controllers/userController");
const { authGuard } = require("../middleware/authGuard");

// Create User
router.post("/create", userController.createUser);

// Login User
router.post("/login", userController.loginUser);

// get single user
router.get("/get_single_user", authGuard, userController.getSingleUser);

// update profile
router.put("/update_profile", authGuard, userController.updateProfile);

module.exports = router;
