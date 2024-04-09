const CartManager = require("../dao/cart-manager.js");

class CartController {
  constructor() {
    this.cartManager = new CartManager();
  }

  async createCart(req, res) {
    try {
      const newCart = await this.cartManager.crearCart();
      res.status(201).json(newCart);
    } catch (error) {
      console.error("Error al crear un carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getCartById(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await this.cartManager.getCartById(cartId);
      if (!cart) {
        res.status(404).json({ error: "Carrito no encontrado" });
        return;
      }
      res.json(cart.products);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async addProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
      const updatedCart = await this.cartManager.addProductToCart(
        cartId,
        productId,
        quantity
      );
      res.json(updatedCart.products);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async removeProductFromCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      await this.cartManager.removeProductFromCart(cartId, productId);
      res.json({ message: "Producto eliminado del carrito correctamente" });
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateCart(req, res) {
    const cartId = req.params.cid;
    const newProducts = req.body.products;
    try {
      const updatedCart = await this.cartManager.updateCart(
        cartId,
        newProducts
      );
      res.json(updatedCart.products);
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateProductQuantity(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    try {
      const updatedCart = await this.cartManager.updateProductQuantity(
        cartId,
        productId,
        quantity
      );
      res.json(updatedCart.products);
    } catch (error) {
      console.error(
        "Error al actualizar la cantidad del producto en el carrito:",
        error
      );
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async removeAllProductsFromCart(req, res) {
    const cartId = req.params.cid;
    try {
      await this.cartManager.removeAllProductsFromCart(cartId);
      res.json({
        message:
          "Todos los productos han sido eliminados del carrito correctamente",
      });
    } catch (error) {
      console.error(
        "Error al eliminar todos los productos del carrito:",
        error
      );
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = CartController;
