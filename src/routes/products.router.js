const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/products.controller.js");
const productController = new ProductController();
const addLogger = require("../utils/logger.js");
const authMiddleware = require("../middleware/authmiddleware.js");

router.use(addLogger);

router.get("/", authMiddleware, productController.getProducts);
router.get("/:pid", authMiddleware, productController.getProductById);
router.post("/", authMiddleware, productController.addProduct);
router.put("/:pid", authMiddleware, productController.updateProduct);
router.delete("/:pid", authMiddleware, productController.deleteProduct);

module.exports = router;
