const CartModel = require("../models/cart.model.js");
const mongoose = require("mongoose");

class CartManager {
  async crearCart() {
    try {
      const newCart = new CartModel({
        _id: new mongoose.Types.ObjectId(),
        products: [],
      });
      console.log("Nuevo carrito a guardar:", newCart);
      await newCart.save();
    } catch (error) {
      console.log("error al crear un carrito", error);
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findOne({ _id: cartId }).populate(
        "products.product"
      );
      if (!cart) {
        console.log("Not found");
        return null;
      }
      return cart;
    } catch (error) {
      console.log("error al traer el carrito", error);
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const carrito = await this.getCartById(cartId);
      const existe = carrito.products.find(
        (item) => item.product.toString() === productId
      );

      if (existe) {
        existe.quantity += quantity;
      } else {
        carrito.products.push({ product: productId, quantity });
      }

      carrito.markModified("products");

      await carrito.save();
      return carrito;
    } catch (error) {
      console.log("error al agregar un product");
    }
  }
  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.getCartById(cartId);
      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId
      );
      await cart.save();
      return cart;
    } catch (error) {
      console.log("Error al eliminar producto del carrito:", error);
      throw error;
    }
  }

  async updateCart(cartId, newProducts) {
    try {
      const cart = await this.getCartById(cartId);
      cart.products = newProducts;
      await cart.save();
      return cart;
    } catch (error) {
      console.log("Error al actualizar el carrito:", error);
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await this.getCartById(cartId);
      const product = cart.products.find(
        (item) => item.product.toString() === productId
      );
      if (!product) {
        throw new Error("Producto no encontrado en el carrito");
      }
      product.quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      console.log(
        "Error al actualizar la cantidad del producto en el carrito:",
        error
      );
      throw error;
    }
  }

  async removeAllProductsFromCart(cartId) {
    try {
      const cart = await this.getCartById(cartId);
      cart.products = [];

      await cart.save();

      return cart;
    } catch (error) {
      console.log("Error al eliminar todos los productos del carrito:", error);
      throw error;
    }
  }
}

module.exports = CartManager;
