const logger = require("./utils/logger.js");
require("dotenv").config();
const config = {
  port: process.env.PORT,
  mongodbURI: process.env.MONGODB_URI,
  sessionSecret: process.env.SESSION_SECRET,
};

module.exports = config;
