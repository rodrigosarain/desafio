const mongoose = require("mongoose");
const ProductModel = require("./products.model.js");

const cartSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const CartModel = mongoose.model("carts", cartSchema);

module.exports = CartModel;
