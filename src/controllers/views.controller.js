const ProductModel = require("../models/products.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const authMiddleware = require("../middleware/authmiddleware.js");
const UserModel = require("../models/user.model.js");

class ViewsController {
  async renderProducts(req, res) {
    try {
      req.logger.info("Rendering products");

      const products = await ProductModel.find();
      const cartId = req.user.cart ? req.user.cart.toString() : null;

      res.render("products", { products, session: req.user, cartId });
    } catch (error) {
      req.logger.error("Failed to render products", error);
    }
  }

  async renderCart(req, res) {
    try {
      authMiddleware(req, res, async () => {
        console.log("Usuario:", req.user); // Verifica qué datos tiene req.user
        console.log("CartId:", req.user ? req.user.cart : "No existe cartId"); // Verifica si req.user.cart está definido

        const cartId = req.user.cart;

        if (!cartId) {
          console.log("El usuario no tiene un carrito asociado.");
          return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const carrito = await cartRepository.obtenerProductosDeCarrito(cartId);

        if (!carrito) {
          console.log("No existe ese carrito con el id:", cartId);
          return res.status(404).json({ error: "Carrito no encontrado" });
        }

        let totalCompra = 0;

        const productosEnCarrito = carrito.products.map((item) => {
          const product = item.product.toObject();
          const quantity = item.quantity;
          const totalPrice = product.price * quantity;

          totalCompra += totalPrice;

          return {
            product: { ...product, totalPrice },
            quantity,
            cartId,
          };
        });

        res.render("carts", {
          productos: productosEnCarrito,
          totalCompra,
          cartId,
        });
      });
    } catch (error) {
      console.error("Error al obtener los detalles del producto:", error);
      console.error("Error al obtener el carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async renderLogin(req, res) {
    res.render("login");
  }

  async renderRegister(req, res) {
    res.render("register");
  }

  renderProfile(req, res) {
    if (!req.session.login) {
      return res.redirect("/login");
    }
    res.render("profile", { user: req.session.user });
  }

  async renderRealTimeProducts(req, res) {
    try {
      res.render("realtimeproducts");
    } catch (error) {
      console.log("error en la vista real time", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async renderResetPassword(req, res) {
    res.render("resetpassword");
  }

  async renderCambioPassword(req, res) {
    res.render("passwordcambio");
  }

  async renderConfirmacion(req, res) {
    res.render("confirmacion-envio");
  }

  async renderPremium(req, res) {
    try {
      //ID del usuario desde req.user
      const userId = req.user._id;
      console.log(userId);

      // Renderiza la vista premium y pasa el usuario como dato
      res.render("premium", { user: req.user });
    } catch (error) {
      console.error("Error al renderizar la vista premium:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async renderPanelPremium(req, res) {
    res.render("panel-premium");
  }

  async renderCheckout(req, res) {
    const numTicket = req.query.numTicket;

    // Renderiza la vista checkout.handlebars y pasa el número de ticket como dato
    res.render("checkout", { numTicket });
  }

  async renderHome(req, res) {
    res.render("home");
  }

  async renderAdmin(req, res) {
    try {
      const users = await UserModel.find({}, "first_name last_name email role");
      // console.log(users);

      res.render("admin", { users });
    } catch (error) {
      console.error("Error al renderizar la vista admin:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = ViewsController;
