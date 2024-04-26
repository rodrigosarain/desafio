const ProductModel = require("../models/products.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const authMiddleware = require("../middleware/authmiddleware.js");
const { generarProductosFicticios } = require("../utils/productGenerator.js");

class ViewsController {
  async renderProducts(req, res) {
    try {
      const products = await ProductModel.find();
      res.render("products", { products, session: req.session });

      const cartId = req.user.cart.toString(); //carrito del usuario !!
      console.log("ermano q wea", cartId);
    } catch (error) {
      throw { code: errorHandler.EErrors.BD_ERROR };
    }
  }

  async renderCart(req, res) {
    try {
      // Utilizar el middleware de autenticación para verificar la autenticación del usuario
      authMiddleware(req, res, async () => {
        // Obtener el cartId del usuario desde req.user
        const cartId = req.user.cartId;

        // Verificar si el cartId es válido
        if (!cartId) {
          throw { code: errorHandler.EErrors.NotFoundError };
        }

        // Obtener el carrito del usuario utilizando el cartId
        const carrito = await cartRepository.obtenerProductosDeCarrito(cartId);

        // Verificar si se encontró el carrito
        if (!carrito) {
          throw { code: errorHandler.EErrors.NotFoundError };
        }

        // Calcular el total de la compra
        let totalCompra = 0;
        // Mapear los productos en el carrito y calcular el precio total por producto
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

        // Renderizar la vista del carrito con la información obtenida
        res.render("carts", {
          productos: productosEnCarrito,
          totalCompra,
          cartId,
        });
      });
    } catch (error) {
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
      const productosFicticios = generarProductosFicticios(100);

      // Renderizar la vista de productos ficticios con la información obtenida
      res.render("mockingproducts", { productosFicticios });
      console.log(productosFicticios);
    } catch (error) {
      throw { code: errorHandler.EErrors.BD_ERROR };
    }
  }
}

module.exports = ViewsController;
