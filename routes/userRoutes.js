const router = require("express").Router();
const userController = require("../controllers/userController");

// Create User
router.post("/create", userController.createUser);

// Login User
router.post("/login", userController.loginUser);

module.exports = router;
