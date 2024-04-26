const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/views.controller.js");
const viewsController = new ViewsController();
const checkUserRole = require("../middleware/checkrole.js");
const passport = require("passport");

router.get(
  "/products",
  checkUserRole(["usuario"]),
  passport.authenticate("jwt", { session: false }),
  viewsController.renderProducts
);

router.get("/carts/:cid", viewsController.renderCart);
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get(
  "/realtimeproducts",
  checkUserRole(["admin"]),
  viewsController.renderRealTimeProducts
);
router.get("/chat", checkUserRole(["usuario"]), viewsController.renderChat);
// Nueva ruta para el endpoint '/mockingproducts'
router.get("/mockingproducts", viewsController.renderMockingProducts);

module.exports = router;
