const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/products.controller.js");
const productController = new ProductController();
const addLogger = require("../utils/logger.js");

router.use(addLogger);

router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);
router.post("/", productController.addProduct);
router.put("/:pid", productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);

module.exports = router;
