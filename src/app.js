const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const cors = require("cors");
const path = require("path");
const swagger = require("./swagger");

const addLogger = require("./utils/logger.js");
const PUERTO = 8080;
require("./database.js");

const error_handler = require("./middleware/errorHandler.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static("./src/public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use(addLogger);
//Passport
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());

//AuthMiddleware
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);

//Handlebars
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".handlebars",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../src/views"));
app.use("/api-docs", swagger.serve, swagger.setup);

//Rutas:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);

app.use(error_handler);

app.get("/loggerTest", (req, res) => {
  req.logger.error("failed to load");
  req.logger.debug("ejecting");
  req.logger.info("INFORMATION");
  req.logger.warning("Warning");

  res.send("logs_test");
});

const connectToDatabase = require("./database.js");
connectToDatabase();

const httpServer = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

///Websockets:
const SocketManager = require("./sockets/socketm.js");
new SocketManager(httpServer);
