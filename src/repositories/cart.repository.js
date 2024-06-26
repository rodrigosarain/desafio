const CartModel = require("../models/cart.model.js");

class CartRepository {
  async crearCarrito() {
    try {
      const nuevoCarrito = new CartModel({ products: [] });
      await nuevoCarrito.save();
      return nuevoCarrito;
    } catch (error) {
      console.error("Error al crear un carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      res.status(500).send("Error");
    }
  }

  async obtenerProductosDeCarrito(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        console.error("cart not found", error);
        return null;
      }
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      res.status(500).send("Error");
    }
  }

  async agregarProducto(cartId, productId, quantity = 1) {
    try {
      const carrito = await this.obtenerProductosDeCarrito(cartId);
      const existeProducto = carrito.products.find(
        (item) => item.product._id.toString() === productId
      );

      if (existeProducto) {
        existeProducto.quantity += quantity;
      } else {
        carrito.products.push({ product: productId, quantity });
      }

      carrito.markModified("products");

      await carrito.save();
      return carrito;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      res.status(500).send("Error");
    }
  }

  async eliminarProducto(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        console.error("cart not found", error);
      }
      cart.products = cart.products.filter(
        (item) => item.product._id.toString() !== productId
      );
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      res.status(500).send("Error");
    }
  }

  async actualizarProductosEnCarrito(cartId, updatedProducts) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        console.error("cart not found upload", error);
      }

      cart.products = updatedProducts;

      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async actualizarCantidadesEnCarrito(cartId, productId, newQuantity) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        console.error("cart not found upload cant", error);
      }

      const productIndex = cart.products.findIndex(
        (item) => item._id.toString() === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;

        cart.markModified("products");

        await cart.save();
        return cart;
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async vaciarCarrito(cartId) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );

      if (!cart) {
        console.error("cart not found", error);
      }

      return cart;
    } catch (error) {
      res.status(500).send("Error");
    }
  }
}

module.exports = CartRepository;
