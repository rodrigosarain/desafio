const { EErrors } = require("../services/dictinoary_err.js");

const errorHandler = (error, req, res, next) => {
  console.log("Error pibe q paso:", error.causa); // Depuración

  switch (error.code) {
    case EErrors.TIPO_INVALIDO:
      res.send({ status: "error", error: error.nombre });
      break;
    case EErrors.BD_ERROR:
      res.send({ status: "error", error: "Error de base de datos" });
      break;
    case EErrors.NotFoundError:
      res.send({ status: "error", error: "Recurso no encontrado" });
      break;
    default:
      res.send({ status: "error", error: "Error desconocido" });
  }
};

module.exports = errorHandler;
