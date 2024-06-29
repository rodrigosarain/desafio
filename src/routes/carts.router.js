const express = require("express");
const router = express.Router();
const CartController = require("../controllers/carts.controller.js");
const authMiddleware = require("../middleware/authmiddleware.js");
const cartController = new CartController();
const ViewsController = require("../controllers/views.controller.js");
const viewsController = new ViewsController();

router.use(authMiddleware);

router.post("/", cartController.nuevoCarrito);
router.get("/:cid", cartController.obtenerProductosDeCarrito);
router.post("/:cid/product/:pid", cartController.agregarProductoEnCarrito);
router.delete("/:cid/product/:pid", cartController.eliminarProductoDeCarrito);
router.put("/:cid", cartController.actualizarProductosEnCarrito);
router.put("/:cid/product/:pid", cartController.actualizarCantidad);
router.delete("/:cid", cartController.vaciarCarrito);

router.post("/:cid/purchase", cartController.finalizarCompra);

router.get("/carts/:cid", viewsController.renderCart);

router.get("/checkout", (req, res) => {
  const numTicket = req.query.numTicket;
  res.render("checkout", { numTicket });
});

module.exports = router;
