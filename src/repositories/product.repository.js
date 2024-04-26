const errorHandler = require("../middleware/errorHandler.js");
const { EErrors } = require("../services/dictinoary_err.js");
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
        throw { code: errorHandler.EErrors.TIPO_INVALIDO };
      }

      const existeProducto = await ProductModel.findOne({ code: code });

      if (existeProducto) {
        throw CustomError.crearError({
          nombre: "Ya existe",
          causa: generarInfoExist(),
          mensaje: "Ya existe el producto con esas caracteristicas",
          codigo: EErrors.TIPO_INVALIDO,
        });
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
      throw CustomError.crearError({
        nombre: "Usuario nuevo",
        causa: generarInfoError({ title, price }),
        mensaje: "Error al agregar el product",
        codigo: EErrors.TIPO_INVALIDO,
      });
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
      throw { code: errorHandler.EErrors.BD_ERROR };
    }
  }

  async obtenerProductoPorId(id) {
    try {
      const producto = await ProductModel.findById(id);

      if (!producto) {
        throw { code: errorHandler.EErrors.NotFoundError };
      }

      return producto;
    } catch (error) {
      throw { code: errorHandler.EErrors.BD_ERROR };
    }
  }

  async actualizarProducto(id, productoActualizado) {
    try {
      const updated = await ProductModel.findByIdAndUpdate(
        id,
        productoActualizado
      );
      if (!updated) {
        throw { code: errorHandler.EErrors.NotFoundError };
      }
      console.log("Successfully updated");
      return updated;
    } catch (error) {
      throw { code: errorHandler.EErrors.BD_ERROR };
    }
  }

  async eliminarProducto(id) {
    try {
      const deleted = await ProductModel.findByIdAndDelete(id);

      if (!deleted) {
        throw { code: errorHandler.EErrors.NotFoundError };
      }

      return deleted;
    } catch (error) {
      throw { code: errorHandler.EErrors.BD_ERROR };
    }
  }
}

module.exports = ProductRepository;
