const errorHandler = require("../middleware/errorHandler.js");
const CartModel = require("../models/cart.model.js");

class CartRepository {
  async crearCarrito() {
    try {
      const nuevoCarrito = new CartModel({ products: [] });
      await nuevoCarrito.save();
      return nuevoCarrito;
    } catch (error) {
      throw { code: errorHandler.EErrors.BD_ERROR };
    }
  }

  async obtenerProductosDeCarrito(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw { code: errorHandler.EErrors.NotFoundError };
        return null;
      }
      return cart;
    } catch (error) {
      throw { code: errorHandler.EErrors.BD_ERROR };
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
      throw { code: errorHandler.EErrors.BD_ERROR };
    }
  }

  async eliminarProducto(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw { code: errorHandler.EErrors.NotFoundError };
      }
      cart.products = cart.products.filter(
        (item) => item.product._id.toString() !== productId
      );
      await cart.save();
      return cart;
    } catch (error) {
      throw { code: errorHandler.EErrors.BD_ERROR };
    }
  }

  async actualizarProductosEnCarrito(cartId, updatedProducts) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw { code: errorHandler.EErrors.NotFoundError };
      }

      cart.products = updatedProducts;

      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      throw { code: errorHandler.EErrors.BD_ERROR };
    }
  }

  async actualizarCantidadesEnCarrito(cartId, productId, newQuantity) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw { code: errorHandler.EErrors.NotFoundError };
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
      throw { code: errorHandler.EErrors.BD_ERROR };
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
        throw { code: errorHandler.EErrors.NotFoundError };
      }

      return cart;
    } catch (error) {
      throw { code: errorHandler.EErrors.BD_ERROR };
    }
  }
}

module.exports = CartRepository;
