const passport = require("passport");

function authMiddleware(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.user = null;
    } else {
      req.user = user;
    }
    // Si el usuario está autenticado, adjuntar el cartId al objeto req.user
    if (user.cart) {
      req.user.cartId = user.cart.toString();
    }

    next();
  })(req, res, next);
}

module.exports = authMiddleware;
