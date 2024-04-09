const ProductManager = require("../dao/product-manager.js");

class ProductController {
  constructor() {
    this.productManager = new ProductManager();
  }

  async getProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const sort =
        req.query.sort === "asc"
          ? "asc"
          : req.query.sort === "desc"
          ? "desc"
          : null;
      const query = req.query.query || null;

      let products = await this.productManager.getProducts();

      // Aplicar el filtro según el query
      if (query) {
        products = products.filter((product) => product.category === query);
      }

      // Ordenar los productos si se proporciona sort
      if (sort) {
        products.sort((a, b) => {
          if (sort === "asc") {
            return a.price - b.price;
          } else {
            return b.price - a.price;
          }
        });
      }

      // Calcular el índice de inicio y final según la página y el límite
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      // Obtener los productos de la página actual
      const pageProducts = products.slice(startIndex, endIndex);

      const totalPages = Math.ceil(products.length / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      const prevPage = hasPrevPage ? page - 1 : null;
      const nextPage = hasNextPage ? page + 1 : null;

      const prevLink = hasPrevPage
        ? `/api/products?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}`
        : null;
      const nextLink = hasNextPage
        ? `/api/products?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}`
        : null;

      res.json({
        status: "success",
        payload: pageProducts,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: prevLink,
        nextLink: nextLink,
      });
    } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }

  async getProductById(req, res) {
    const productId = req.params.pid;

    try {
      const product = await this.productManager.getProductById(productId);
      if (!product) {
        return res.json({
          error: "Producto no encontrado",
        });
      }

      res.json(product);
    } catch (error) {
      console.error("Error al obtener producto", error);
      res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }

  async addProduct(req, res) {
    const newProduct = req.body;

    try {
      await this.productManager.addProduct(newProduct);
      res.status(201).json({
        message: "Producto agregado exitosamente",
      });
    } catch (error) {
      console.error("Error al agregar producto", error);
      res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }

  async updateProduct(req, res) {
    const productId = req.params.pid;
    const updatedProduct = req.body;

    try {
      await this.productManager.updateProduct(productId, updatedProduct);
      res.json({
        message: "Producto actualizado exitosamente",
      });
    } catch (error) {
      console.error("Error al actualizar producto", error);
      res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }

  async deleteProduct(req, res) {
    const productId = req.params.pid;

    try {
      await this.productManager.deleteProduct(productId);
      res.json({
        message: "Producto eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar producto", error);
      res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }
}

module.exports = ProductController;
