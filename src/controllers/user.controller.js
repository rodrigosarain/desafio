const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
const UserDTO = require("../dto/user.dto.js");

const { generateResetToken } = require("../utils/tokenreset.js");

const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();

const moment = require("moment");

class UserController {
  async register(req, res) {
    const { first_name, last_name, email, password, age } = req.body;
    try {
      const existeUsuario = await UserModel.findOne({ email });
      if (existeUsuario) {
        return res.status(400).send("El usuario ya existe");
      }

      //Creo un nuevo carrito:
      const nuevoCarrito = new CartModel();
      await nuevoCarrito.save();

      const nuevoUsuario = new UserModel({
        first_name,
        last_name,
        email,
        cart: nuevoCarrito._id,
        password: createHash(password),
        age,
      });

      await nuevoUsuario.save();

      const token = jwt.sign({ user: nuevoUsuario }, "coderhouse", {
        expiresIn: "1h",
      });

      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/api/users/profile");
    } catch (error) {
      console.error(error);
      console.error("Error al registrarse", error);
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const usuarioEncontrado = await UserModel.findOne({ email });

      if (!usuarioEncontrado) {
        return res.status(401).send("Usuario no válido");
      }

      const esValido = isValidPassword(password, usuarioEncontrado);
      if (!esValido) {
        return res.status(401).send("Contraseña incorrecta");
      }

      usuarioEncontrado.last_login = Date.now();
      await usuarioEncontrado.save();

      const token = jwt.sign({ user: usuarioEncontrado }, "coderhouse", {
        expiresIn: "1h",
      });

      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/api/users/profile");
    } catch (error) {
      console.error(error);
      console.error("Error al logearse", error);
    }
  }

  async profile(req, res) {
    try {
      const isPremium = req.user.role === "premium";
      const userDto = new UserDTO(
        req.user.first_name,
        req.user.last_name,
        req.user.role
      );
      const isAdmin = req.user.role === "admin";

      res.render("profile", { user: userDto, isPremium, isAdmin });
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }

  async logout(req, res) {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
  }

  async admin(req, res) {
    if (req.user.user.role !== "admin") {
      return res.status(403).send("Acceso denegado");
    }
    res.render("admin");
  }

  async requestPasswordReset(req, res) {
    const { email } = req.body;

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      const token = generateResetToken();

      user.resetToken = {
        token: token,
        expiresAt: new Date(Date.now() + 3600000),
      };
      await user.save();

      // Enviar correo electrónico con el enlace de restablecimiento utilizando EmailService
      await emailManager.enviarCorreoRestablecimiento(
        email,
        user.first_name,
        token
      );

      res.redirect("/confirmacion-envio");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async resetPassword(req, res) {
    const { email, password, token } = req.body;

    try {
      const user = await UserModel.findOne({ email });

      // Verificar si el usuario existe
      if (!user) {
        return res.render("passwordcambio", { error: "Usuario no encontrado" });
      }

      const resetToken = user.resetToken;

      // Verificar si el token de restablecimiento es válido
      if (!resetToken || resetToken.token !== token) {
        return res.render("passwordreset", {
          error: "El token de restablecimiento de contraseña es inválido",
        });
      }

      // Verificar si el token ha expirado
      const now = new Date();
      if (now > resetToken.expiresAt) {
        return res.redirect("/passwordcambio");
      }

      // Verificar si la nueva contraseña no es igual a la anterior
      if (isValidPassword(password, user)) {
        return res.render("passwordcambio", {
          error: "La nueva contraseña no puede ser igual a la anterior",
        });
      }

      // Hash de la nueva contraseña y actualización del usuario
      user.password = createHash(password);
      user.resetToken = undefined; // Limpiar el token de restablecimiento

      // Guardar el usuario actualizado en la base de datos
      await user.save();

      // Redirigir al usuario a la página de login
      return res.redirect("/login");
    } catch (error) {
      console.error(
        "Error al procesar el restablecimiento de contraseña:",
        error
      );
      return res.status(500).render("passwordreset", {
        error: "Error interno del servidor al restablecer la contraseña",
      });
    }
  }

  async cambiarRolPremium(req, res) {
    try {
      const { uid } = req.params;
      const user = await UserModel.findById(uid);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const nuevoRol = user.role === "usuario" ? "premium" : "usuario";

      const actualizado = await UserModel.findByIdAndUpdate(
        uid,
        { role: nuevoRol },
        { new: true }
      );

      res.json(actualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  async cambiarRolPremiumForm(req, res) {
    try {
      const { uid } = req.params;
      const user = await UserModel.findById(uid);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.render("premium", { user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await UserModel.find({}, "first_name last_name email role");
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async deleteInactiveUsers(req, res) {
    const cutoffDate = moment().subtract(2, "days").toDate(); // Cambiar a 2 días para producción

    try {
      const inactiveUsers = await UserModel.find({
        last_login: { $lt: cutoffDate },
      });

      for (let user of inactiveUsers) {
        await emailManager.sendDeletionEmail(user.email, user.first_name); // Enviar correo de eliminación
        await UserModel.deleteOne({ _id: user._id }); // Eliminar usuario
      }

      res.json({
        message: `${inactiveUsers.length} usuarios eliminados por inactividad`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async deleteUser(req, res) {
    try {
      const { uid } = req.params;
      const user = await UserModel.findByIdAndDelete(uid);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json({ message: "Usuario eliminado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async cambiarRol(req, res) {
    try {
      const { uid } = req.params;
      const { nuevoRol } = req.body;

      const user = await UserModel.findById(uid);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const rolesPermitidos = ["usuario", "premium", "admin"];
      if (!rolesPermitidos.includes(nuevoRol)) {
        return res.status(400).json({ message: "Rol no válido" });
      }

      const actualizado = await UserModel.findByIdAndUpdate(
        uid,
        { role: nuevoRol },
        { new: true }
      );

      res.json(actualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

module.exports = UserController;
