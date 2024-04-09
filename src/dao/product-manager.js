const ProductModel = require("../models/products.model.js");

class ProductManager {
  async addProduct({
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
        console.log("All fields are required");
        return;
      }

      //Acá tenemos que cambiar la validacion:
      const existeProducto = await ProductModel.findOne({ code: code });

      if (existeProducto) {
        console.log("Code must be unique");
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
    } catch (error) {
      console.log("Error al agregar producto", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      const productos = await ProductModel.find();
      return productos;
    } catch (error) {
      console.log("Error al obtener los productos", error);
    }
  }

  async getProductById(id) {
    try {
      const producto = await ProductModel.findById(id);

      if (!producto) {
        console.log("Producto no encontrado");
        return null;
      }

      console.log("Product find");
      return producto;
    } catch (error) {
      console.log("error ");
    }
  }

  async updateProduct(id, productoActualizado) {
    try {
      const updateado = await ProductModel.findByIdAndUpdate(
        id,
        productoActualizado
      );

      if (!updateado) {
        console.log("Product Not found");
        return null;
      }

      console.log("Product Updated");
      return updateado;
    } catch (error) {
      console.log("Failed up to update", error);
    }
  }

  async deleteProduct(id) {
    try {
      const deleteado = await ProductModel.findByIdAndDelete(id);

      if (!deleteado) {
        console.log("Not found");
        return null;
      }

      console.log("Erase succefull");
    } catch (error) {
      console.log("Delete failed", error);
      throw error;
    }
  }
}

module.exports = ProductManager;
