const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const authMiddleware = require("../middleware/authmiddleware.js");

class ProductController {
  async addProduct(req, res) {
    const nuevoProducto = req.body;
    try {
      const resultado = await productRepository.agregarProducto(nuevoProducto);
      res.json(resultado);
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async getProducts(req, res) {
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
      res.status(500).send("Error");
    }
  }

  async getProductById(req, res) {
    const id = req.params.pid;
    try {
      const buscado = await productRepository.obtenerProductoPorId(id);
      if (!buscado) {
        return res.json({
          error: "Producto no encontrado",
        });
      }
      res.json(buscado);
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async updateProduct(req, res) {
    try {
      const id = req.params.pid;
      const productoActualizado = req.body;

      const resultado = await productRepository.actualizarProducto(
        id,
        productoActualizado
      );
      res.json(resultado);
    } catch (error) {
      res.status(500).send("Error al actualizar el producto");
    }
  }

  async deleteProduct(req, res) {
    const id = req.params.pid;
    try {
      let respuesta = await productRepository.eliminarProducto(id);

      res.json(respuesta);
    } catch (error) {
      res.status(500).send("Error al eliminar el producto");
    }
  }
}

module.exports = ProductController;
