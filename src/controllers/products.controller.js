const logger = require("../utils/logger.js");
const errorHandler = require("../middleware/errorHandler.js");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const authMiddleware = require("../middleware/authmiddleware.js");
const { generarProductosFicticios } = require("../utils/productGenerator.js");

class ProductController {
  async addProduct(req, res, next) {
    const nuevoProducto = req.body;
    try {
      const resultado = await productRepository.agregarProducto(nuevoProducto);
      logger.info("Producto agregado:", resultado);
    } catch (error) {
      next({ code: errorHandler.EErrors.BD_ERROR });
      logger.error("Error al agregar producto:", error);
    }
  }

  async getProducts(req, res, next) {
    const cartId = req.user.cart.toString();
    try {
      req.logger.info("Rendering products");
      let { limit = 10, page = 1, sort, query } = req.query;

      const productos = await productRepository.obtenerProductos({
        limit,
        page,
        sort,
        query,
      });

      // Verificar si hay productos
      if (productos.docs.length === 0) {
        logger.warning("No hay productos disponibles");
      }

      res.json(productos);
    } catch (error) {
      next({ code: errorHandler.EErrors.BD_ERROR });
      logger.error("Error al obtener productos:", error);
    }
  }

  async getProductById(req, res, next) {
    const id = req.params.pid;
    try {
      const buscado = await productRepository.obtenerProductoPorId(id);
      if (!buscado) {
        throw { code: errorHandler.EErrors.NotFoundError };
      }
      res.json(buscado);
    } catch (error) {
      next({ code: errorHandler.EErrors.BD_ERROR });
      logger.error("Error al obtener producto por ID:", error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const id = req.params.pid;
      const productoActualizado = req.body;

      const resultado = await productRepository.actualizarProducto(
        id,
        productoActualizado
      );
      res.json(resultado);
      logger.info("Producto actualizado:", resultado);
    } catch (error) {
      next({ code: errorHandler.EErrors.BD_ERROR });
      logger.error("Error al actualizar producto:", error);
    }
  }

  async deleteProduct(req, res, next) {
    const id = req.params.pid;
    try {
      let respuesta = await productRepository.eliminarProducto(id);

      res.json(respuesta);
      logger.info("Producto eliminado:", respuesta);
    } catch (error) {
      next({ code: errorHandler.EErrors.BD_ERROR });
      logger.error("Error al eliminar producto:", error);
    }
  }
}

module.exports = ProductController;
