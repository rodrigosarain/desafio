const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const config = require("./config");

//  rutas del enrutador
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const userRouter = require("./routes/user.router.js");
const viewsRouter = require("./routes/views.router.js");

const app = express();
const PUERTO = config.port;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../src/public")));
app.use(cookieParser());
app.use(
  session({
    secret: "secretRecklessLove",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://rodriisaraiin:Pj3SAQwRPORndaJ1@cluster0.gy4hj4r.mongodb.net/e-comerce?retryWrites=true&w=majority&appName=Cluster0",
      ttl: 100,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Configura el motor de plantillas Handlebars
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

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);

const connectToDatabase = require("./database.js");
connectToDatabase();

// Inicia el servidor
const server = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
