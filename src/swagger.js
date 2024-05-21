const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación Curso Backend",
      version: "1.0.0",
      description:
        "Documentación de la API para los módulos de productos y carrito",
    },
  },
  apis: ["./src/docs/**/*.yaml"],
};

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerJsdoc(options)),
};
