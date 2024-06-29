const { generarInfoExist, generarInfoError } = require("../services/info.js");
const CustomError = require("../services/custom_error.js");
const ProductModel = require("../models/products.model.js");

class ProductRepository {
  async agregarProducto({
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        throw new Error("Faltan datos obligatorios para agregar el producto");
      }

      const existeProducto = await ProductModel.findOne({ code: code });

      if (existeProducto) {
        throw new Error("Ya existe un producto con el código especificado");
      }

      const newProduct = new ProductModel({
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [],
      });

      await newProduct.save();

      return newProduct;
    } catch (error) {
      console.error("Error al agregar los productos", error);
      res.status(500).send("Error");
    }
  }

  async obtenerProductos(limit = 10, page = 1, sort, query) {
    try {
      const skip = (page - 1) * limit;

      let queryOptions = {};

      if (query) {
        queryOptions = { category: query };
      }

      const sortOptions = {};
      if (sort) {
        if (sort === "asc" || sort === "desc") {
          sortOptions.price = sort === "asc" ? 1 : -1;
        }
      }

      const productos = await ProductModel.find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const totalProducts = await ProductModel.countDocuments(queryOptions);

      const totalPages = Math.ceil(totalProducts / limit);

      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: productos,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage
          ? `/api/products?limit=${limit}&page=${
              page - 1
            }&sort=${sort}&query=${query}`
          : null,
        nextLink: hasNextPage
          ? `/api/products?limit=${limit}&page=${
              page + 1
            }&sort=${sort}&query=${query}`
          : null,
      };
    } catch (error) {
      console.error("Error al obtener los productos", error);
      res.status(500).send("Error");
    }
  }

  async obtenerProductoPorId(id) {
    try {
      const producto = await ProductModel.findById(id);

      if (!producto) {
        throw new Error("Producto no encontrado");
      }

      if (producto.status === undefined) {
        producto.status = producto.stock > 0; // Asignamos un valor al status si no está definido
        await producto.save();
      }

      return producto;
    } catch (error) {
      console.error("Error al obtener los productos por id", error);
      res.status(500).send("Error");
    }
  }

  async actualizarProducto(id, productoActualizado) {
    try {
      const updated = await ProductModel.findByIdAndUpdate(
        id,
        productoActualizado
      );
      if (!updated) {
        throw new Error("Producto no encontrado");
      }
      console.log("Successfully updated");
      return updated;
    } catch (error) {
      console.error("Error al actualizar los productos", error);
      res.status(500).send("Error");
    }
  }

  async eliminarProducto(id) {
    try {
      const deleted = await ProductModel.findByIdAndDelete(id);

      if (!deleted) {
        throw new Error("Producto no encontrado");
      }

      return deleted;
    } catch (error) {
      console.error("Error al eliminar los productos", error);
      res.status(500).send("Error");
    }
  }
}

module.exports = ProductRepository;
