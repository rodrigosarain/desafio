const mongoose = require("mongoose");
const config = require("./config");

async function connectToDatabase() {
  try {
    await mongoose.connect(config.mongodbURI);
    console.log("Conectados a la base de datos");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
}

module.exports = connectToDatabase;
