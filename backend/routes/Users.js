const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { registerValidation, loginValidation, validate } = require("../middlewares/validation");

// Test API
router.get("/s", (req, res) => res.send("API is working properly!"));

// Routes
router.get("/user", userController.getUsers);
router.post("/register", registerValidation, validate, userController.registerUser);
router.post("/login", loginValidation, validate, userController.loginUser);
router.post("/updateuser", userController.updateUser);

module.exports = router;
