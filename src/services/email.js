const nodemailer = require("nodemailer");

class EmailManager {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: "rodriisaraiin@gmail.com",
        pass: "nzdt xvmq dmud tlgz",
      },
    });
  }

  async enviarCorreoCompra(email, first_name, ticket, products, total) {
    try {
      const productsList = products
        .map(
          (product) =>
            `<li>${product.name} - Cantidad: ${product.quantity}</li>`
        )
        .join("");

      const mailOptions = {
        from: "Reckless Love <rodriisaraiin@gmail.com>",
        to: email,
        subject: "Your Order",
        html: `
          <h1>Order Confirmation</h1>
          <p>Thanks for your purchase, ${first_name}!</p>
          <p>Your order number is: ${ticket}</p>
          <h2>Order Details:</h2>
          <ul>
            ${productsList}
          </ul>
          <p>Total Amount: $${total}</p>
          <p>Please send your transfer to alias reckless.pago and your proof to 055-888-AMORE.</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);

      console.log(`Enviando correo a ${email} con ticket ${ticket}`);
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      throw new Error("Error al enviar el correo electrónico de compra");
    }
  }

  async enviarCorreoRestablecimiento(email, first_name, token) {
    try {
      const mailOptions = {
        from: "Reckless Love <rodriisaraiin@gmail.com>",
        to: email,
        subject: "Restablecimiento de Contraseña",
        html: `
                    <h1>Restablecimiento de Contraseña</h1>
                    <p>Hola ${first_name},</p>
                    <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para cambiar tu contraseña:</p>
                    <p><strong>${token}</strong></p>
                    <p>Este código expirará en 1 hora.</p>
                    <a href="http://localhost:8080/password">Restablecer Contraseña</a>
                    <p>Si no solicitaste este restablecimiento, ignora este correo.</p>
                `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error al enviar correo electrónico:", error);
      throw new Error("Error al enviar correo electrónico");
    }
  }

  async sendDeletionEmail(email, firstName) {
    const mailOptions = {
      from: "Reckless Love <rodriisaraiin@gmail.com>",
      to: email,
      subject: "Cuenta eliminada por inactividad",
      text: `Hola ${firstName},\n\nTu cuenta ha sido eliminada debido a inactividad.\n\nSaludos,\nTu equipo`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }
  }
}

module.exports = EmailManager;
