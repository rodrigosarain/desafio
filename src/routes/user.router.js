const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");

// Rutas de autenticación
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/admin", userController.admin);
router.get("/logout", userController.logout);

module.exports = router;
