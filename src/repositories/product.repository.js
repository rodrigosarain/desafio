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
        console.log("all fields required");
        return;
      }

      const existeProducto = await ProductModel.findOne({ code: code });

      if (existeProducto) {
        console.log("code must be unique");
        return;
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
      throw new Error("Error");
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
      throw new Error("Error");
    }
  }

  async obtenerProductoPorId(id) {
    try {
      const producto = await ProductModel.findById(id);

      if (!producto) {
        console.log("Product not found");
        return null;
      }

      console.log("Product found");
      return producto;
    } catch (error) {
      throw new Error("Error");
    }
  }

  async actualizarProducto(id, productoActualizado) {
    try {
      const updated = await ProductModel.findByIdAndUpdate(
        id,
        productoActualizado
      );
      if (!updated) {
        console.log("cannot find product");
        return null;
      }

      console.log("Successfully updated");
      return updated;
    } catch (error) {
      throw new Error("Error");
    }
  }

  async eliminarProducto(id) {
    try {
      const deleted = await ProductModel.findByIdAndDelete(id);

      if (!deleted) {
        console.log("cannot find product");
        return null;
      }

      console.log("product deleted");
      return deleted;
    } catch (error) {
      throw new Error("Error");
    }
  }
}

module.exports = ProductRepository;
