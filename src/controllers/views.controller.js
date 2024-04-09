const ProductModel = require("../models/products.model.js");
const userController = require("../controllers/user.controller.js");

class ViewsController {
  async renderProducts(req, res) {
    try {
      const products = await ProductModel.find();
      res.render("products", { products, session: req.session });
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async renderProductDetails(req, res) {
    const productId = req.params.id;

    try {
      const product = await ProductModel.findById(productId);
      if (!product) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
      }
      res.render("product-details", { product });
    } catch (error) {
      console.error("Error al obtener los detalles del producto:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  renderLogin(req, res) {
    if (req.session.login) {
      return res.redirect("/products");
    }
    res.render("login");
  }

  renderRegister(req, res) {
    if (req.session.login) {
      return res.redirect("/profile");
    }
    res.render("register");
  }

  renderProfile(req, res) {
    if (!req.session.login) {
      return res.redirect("/login");
    }
    res.render("profile", { user: req.session.user });
  }
}

module.exports = new ViewsController();
