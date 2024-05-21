const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();
const addLogger = require("../utils/logger.js");
router.use(addLogger);

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.profile
);
router.post("/logout", userController.logout.bind(userController));
router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  userController.admin
);

router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);
router.put("/premium/:uid", userController.cambiarRolPremium);

router.get("/cambiar-rol-premium/:uid", userController.cambiarRolPremiumForm);
router.post("/cambiar-rol-premium/:uid", userController.cambiarRolPremium);

module.exports = router;
