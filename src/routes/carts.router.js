const express = require("express");
const router = express.Router();
const CartController = require("../controllers/carts.controller.js");
const cartController = new CartController();

router.post("/", cartController.createCart.bind(cartController));
router.get("/:cid", cartController.getCartById.bind(cartController));
router.post(
  "/:cid/products/:pid",
  cartController.addProductToCart.bind(cartController)
);
router.delete(
  "/:cid/products/:pid",
  cartController.removeProductFromCart.bind(cartController)
);
router.put("/:cid", cartController.updateCart.bind(cartController));
router.put(
  "/:cid/products/:pid",
  cartController.updateProductQuantity.bind(cartController)
);
router.delete(
  "/:cid",
  cartController.removeAllProductsFromCart.bind(cartController)
);

module.exports = router;
