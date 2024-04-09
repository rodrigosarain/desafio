const UserModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

class UserController {
  async register(req, res) {
    const { usuario, password } = req.body;
    try {
      // Verificar si el usuario ya existe
      const existeUsuario = await UserModel.findOne({ usuario });
      if (existeUsuario) {
        return res.status(400).send("El usuario ya existe");
      }

      // Crear un nuevo usuario
      const nuevoUsuario = new UserModel({ usuario, password });
      await nuevoUsuario.save();

      // Generar el token JWT
      const token = jwt.sign(
        { usuario: nuevoUsuario.usuario },
        "reckless_secret",
        {
          expiresIn: "1h",
        }
      );

      // Establecer el token como cookie
      res.cookie("jwtToken", token, {
        maxAge: 3600000, // 1 hora de expiración
        httpOnly: true, // La cookie solo es accesible mediante HTTP(S)
      });

      // Configurar la sesión
      req.session.login = true;
      req.session.user = {
        first_name: nuevoUsuario.first_name,
        last_name: nuevoUsuario.last_name,
        email: nuevoUsuario.email,
      };

      res.redirect("/products");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async login(req, res) {
    const { usuario, password } = req.body;
    try {
      const usuarioEncontrado = await UserModel.findOne({ usuario });

      if (!usuarioEncontrado) {
        return res.status(401).send("Usuario no válido");
      }

      if (password !== usuarioEncontrado.password) {
        return res.status(401).send("Contraseña incorrecta");
      }

      const token = jwt.sign(
        { usuario: usuarioEncontrado.usuario },
        "mi_secreto",
        {
          expiresIn: "1h",
        }
      );

      res.cookie("jwtToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      req.session.user = {
        first_name: usuarioEncontrado.first_name,
        last_name: usuarioEncontrado.last_name,
        age: usuarioEncontrado.age,
        email: usuarioEncontrado.email,
      };

      req.session.login = true;

      res.redirect("/products");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("jwtToken");
      req.session.destroy((err) => {
        if (err) {
          console.error("Error al destruir la sesión:", err);
          res.status(500).send("Error interno del servidor");
          return;
        }
        console.log("Sesión de usuario destruida correctamente");
        res.redirect("/login");
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async admin(req, res) {
    try {
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }
}

module.exports = new UserController();
