const ProductModel = require("../models/products.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const authMiddleware = require("../middleware/authmiddleware.js");
const { generarProductosFicticios } = require("../utils/productGenerator.js");

class ViewsController {
  async renderProducts(req, res) {
    try {
      req.logger.info("Rendering products");

      const products = await ProductModel.find();
      res.render("products", { products, session: req.session });

      const cartId = req.user.cart.toString(); //carrito del usuario !!
    } catch (error) {
      req.logger.error("Failed to render products");
      throw { code: errorHandler.EErrors.BD_ERROR };
    }
  }

  async renderCart(req, res) {
    try {
      authMiddleware(req, res, async () => {
        const cartId = req.user.cartId;

        if (!cartId) {
          throw { code: errorHandler.EErrors.NotFoundError };
        }

        const carrito = await cartRepository.obtenerProductosDeCarrito(cartId);

        if (!carrito) {
          throw { code: errorHandler.EErrors.NotFoundError };
        }
        a;
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
      req.logger.error("Failed to render cart");
      throw { code: errorHandler.EErrors.BD_ERROR };
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

  async renderChat(req, res) {
    res.render("chat");
  }

  async renderRealTimeProducts(req, res) {
    try {
      res.render("realtimeproducts");
    } catch (error) {
      throw { code: errorHandler.EErrors.NotFoundError };
    }
  }

  // Nuevo método para renderizar la vista de productos ficticios generados
  async renderMockingProducts(req, res) {
    try {
      // Generar 100 productos ficticios
      req.logger.info("Rendering mocking products");
      const productosFicticios = generarProductosFicticios(50);

      // Renderizar la vista de productos ficticios con la información obtenida
      res.render("mockingproducts", { productosFicticios });
      req.logger.debug("Generated mocking products:", productosFicticios);
    } catch (error) {
      req.logger.error("Failed to render mocking products");
      throw { code: errorHandler.EErrors.BD_ERROR };
    }
  }
}

module.exports = ViewsController;
