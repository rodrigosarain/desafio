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
      res.json(resultado);
    } catch (error) {
      next({ code: errorHandler.EErrors.BD_ERROR });
    }
  }

  async getProducts(req, res, next) {
    const cartId = req.user.cart.toString();
    try {
      let { limit = 10, page = 1, sort, query } = req.query;

      const productos = await productRepository.obtenerProductos({
        limit,
        page,
        sort,
        query,
      });

      // Verificar si hay productos
      if (productos.docs.length === 0) {
        console.log("No hay productos disponibles");
      }

      res.json(productos);
    } catch (error) {
      next({ code: errorHandler.EErrors.BD_ERROR });
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
    } catch (error) {
      next({ code: errorHandler.EErrors.BD_ERROR });
    }
  }

  async deleteProduct(req, res, next) {
    const id = req.params.pid;
    try {
      let respuesta = await productRepository.eliminarProducto(id);

      res.json(respuesta);
    } catch (error) {
      next({ code: errorHandler.EErrors.BD_ERROR });
    }
  }
}

module.exports = ProductController;
