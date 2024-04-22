const ProductModel = require("../models/products.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const authMiddleware = require("../middleware/authmiddleware.js");

class ViewsController {
  async renderProducts(req, res) {
    try {
      const products = await ProductModel.find();
      res.render("products", { products, session: req.session });

      const cartId = req.user.cart.toString(); //carrito del usuario !!
      console.log("ermano q wea", cartId);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
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
          console.log("El usuario no tiene un carrito asociado.");
          return res.status(404).json({ error: "Carrito no encontrado" });
        }

        // Obtener el carrito del usuario utilizando el cartId
        const carrito = await cartRepository.obtenerProductosDeCarrito(cartId);

        // Verificar si se encontró el carrito
        if (!carrito) {
          console.log("No existe ese carrito con el id");
          return res.status(404).json({ error: "Carrito no encontrado" });
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

  async renderChat(req, res) {
    res.render("chat");
  }

  async renderRealTimeProducts(req, res) {
    try {
      res.render("realtimeproducts");
    } catch (error) {
      console.log("error en la vista real time", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = ViewsController;
