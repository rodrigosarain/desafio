const express = require("express");
const router = express.Router();
const viewsController = require("../controllers/views.controller.js");
const userController = require("../controllers/user.controller.js");

router.get("/products", viewsController.renderProducts);
router.get("/products/:id", viewsController.renderProductDetails);
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/profile", viewsController.renderProfile);

module.exports = router;
