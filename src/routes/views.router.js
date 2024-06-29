const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/views.controller.js");
const viewsController = new ViewsController();
const checkUserRole = require("../middleware/checkrole.js");
const passport = require("passport");
const addLogger = require("../utils/logger.js");

router.use(addLogger);

router.get(
  "/products",
  passport.authenticate("jwt", { session: false }),
  checkUserRole(["usuario"]),
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

router.get("/reset-password", viewsController.renderResetPassword);
router.get("/password", viewsController.renderCambioPassword);
router.get("/confirmacion-envio", viewsController.renderConfirmacion);
router.get("/panel-premium", viewsController.renderPremium);

router.get("/checkout", viewsController.renderCheckout);

module.exports = router;
