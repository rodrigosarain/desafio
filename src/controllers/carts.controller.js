const logger = require("../utils/logger.js");
const TicketModel = require("../models/ticket.model.js");
const UserModel = require("../models/user.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const { generateUniqueCode, calcularTotal } = require("../utils/cartutils.js");
const EmailManager = require("../services/email.js");

const purchaseLocks = new Map();

class CartController {
  async nuevoCarrito(req, res) {
    try {
      const nuevoCarrito = await cartRepository.crearCarrito();
      res.json(nuevoCarrito);
    } catch (error) {
      console.error("Error al crear un carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      res.status(500).send("Error");
    }
  }

  async obtenerProductosDeCarrito(req, res) {
    const cartId = req.params.cid;
    try {
      const productos = await cartRepository.obtenerProductosDeCarrito(cartId);
      if (!productos) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.json(productos);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      res.status(500).send("Error");
    }
  }

  async agregarProductoEnCarrito(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
      await cartRepository.agregarProducto(cartId, productId, quantity);
      const carritoID = req.user.cart.toString();
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      res.status(500).send("Error");
    }
  }

  async eliminarProductoDeCarrito(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      // Recargar el carrito para asegurarte de tener la última versión
      const carrito = await cartRepository.obtenerProductosDeCarrito(cartId);
      if (!carrito) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      // Realizar la operación de eliminación del producto
      const updatedCart = await cartRepository.eliminarProducto(
        cartId,
        productId
      );

      res.json({
        status: "success",
        message: "Producto eliminado del carrito correctamente",
        updatedCart,
      });
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async actualizarProductosEnCarrito(req, res) {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    try {
      const updatedCart = await cartRepository.actualizarProductosEnCarrito(
        cartId,
        updatedProducts
      );
      res.json(updatedCart);
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      res.status(500).send("Error");
    }
  }

  async actualizarCantidad(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;
    try {
      const updatedCart = await cartRepository.actualizarCantidadesEnCarrito(
        cartId,
        productId,
        newQuantity
      );

      res.json({
        status: "success",
        message: "Cantidad del producto actualizada correctamente",
        updatedCart,
      });
    } catch (error) {
      console.error(
        "Error al actualizar la cantidad del producto en el carrito:",
        error
      );
      res.status(500).json({ error: "Error interno del servidor" });
      res.status(500).send("Error al actualizar la cantidad de productos");
    }
  }
  async vaciarCarrito(req, res) {
    const cartId = req.params.cid;
    try {
      const updatedCart = await cartRepository.vaciarCarrito(cartId);

      res.json({
        status: "success",
        message:
          "Todos los productos del carrito fueron eliminados correctamente",
        updatedCart,
      });
    } catch (error) {
      console.error(
        "Error al eliminar todos los productos del carrito:",
        error
      );
      res.status(500).send("Error");
    }
  }

  async finalizarCompra(req, res) {
    const cartId = req.params.cid;
    if (purchaseLocks.get(cartId)) {
      return res
        .status(429)
        .json({ error: "Compra en proceso. Por favor, espere." });
    }

    purchaseLocks.set(cartId, true);

    try {
      // Obtener el carrito con los productos
      const cart = await cartRepository.obtenerProductosDeCarrito(cartId);

      // Verificar si se encontraron productos en el carrito
      if (!cart || !cart.products || cart.products.length === 0) {
        throw new Error("No se encontraron productos en el carrito.");
      }

      // Obtener detalles de cada producto
      const products = cart.products.map((item) => ({
        name: item.product.title,
        quantity: item.quantity,
      }));

      // Asegúrate de que los productos estén estructurados correctamente
      if (products.length === 0) {
        throw new Error("No hay productos válidos para procesar la compra.");
      }

      // Procesar la compra
      const productosNoDisponibles = [];

      for (const item of cart.products) {
        const productId = item.product;
        const product = await productRepository.obtenerProductoPorId(productId);

        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          product.status = product.stock > 0; // Actualizamos el status según el stock
          await product.save();
        } else {
          productosNoDisponibles.push(productId);
        }
      }

      // Crear y guardar el ticket de compra
      const userWithCart = await UserModel.findOne({ cart: cartId });
      const ticket = new TicketModel({
        code: generateUniqueCode(),
        purchase_datetime: new Date(),
        amount: calcularTotal(cart.products),
        purchaser: userWithCart._id,
      });
      await ticket.save();

      console.log(
        `Enviando correo para el ticket: ${ticket._id} al usuario: ${userWithCart.email}`
      );

      // Envío del correo electrónico con los detalles de la compra
      const emailManager = new EmailManager();
      await emailManager.enviarCorreoCompra(
        userWithCart.email,
        userWithCart.first_name,
        ticket._id,
        products,
        ticket.amount
      );

      await cartRepository.vaciarCarrito(cartId);

      // Responder al cliente con el número de ticket
      res.json({ numTicket: ticket._id });
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      res
        .status(500)
        .json({ error: "Error interno del servidor al procesar la compra." });
    } finally {
      purchaseLocks.delete(cartId);
    }
  }
}

module.exports = CartController;
