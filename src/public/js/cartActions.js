// Función para eliminar un producto del carrito
async function eliminarProducto(cartId, productId) {
  try {
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data.message);
      location.reload(); // Actualizar la página después de eliminar el producto
    } else {
      console.error(data.error || "Error al eliminar producto");
    }
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

// Función para vaciar el carrito
async function vaciarCarrito(cartId) {
  try {
    const response = await fetch(`/api/carts/${cartId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data.message);
      location.reload(); // Actualizar la página después de vaciar el carrito
    } else {
      console.error(data.error || "Error al vaciar el carrito");
    }
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (checkoutBtn) {
    checkoutBtn.addEventListener(
      "click",
      async () => {
        const cartId = checkoutBtn.getAttribute("data-cart-id");

        console.log("Clic en el botón Finalizar Compra");

        try {
          const response = await fetch(
            `http://localhost:8080/api/carts/${cartId}/purchase`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // if (!response.ok) {
          //   if (response.status === 429) {
          //     throw new Error(
          //       "Demasiadas solicitudes. Inténtelo de nuevo más tarde."
          //     );
          //   } else {
          //     throw new Error(
          //       "Error al procesar la compra. Código de estado HTTP: " +
          //         response.status
          //     );
          //   }
          // }

          const data = await response.json();

          // Verifica si la respuesta contiene el número de ticket
          const numTicket = data.numTicket;

          if (!numTicket) {
            throw new Error("Número de ticket no encontrado en la respuesta.");
          }

          // Redirigir a la vista de checkout solo después de completar todas las operaciones
          window.location.href = `/checkout?numTicket=${numTicket}`;
        } catch (error) {
          console.error("Error al procesar la compra:", error.message);
          alert("Error al procesar la compra. Inténtelo de nuevo más tarde.");
        }
      },
      { once: true }
    );
  }

  // Escuchar evento de clic para botones de eliminar producto
  const eliminarProductoBtns = document.querySelectorAll(
    ".eliminar-producto-btn"
  );
  eliminarProductoBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const cartId = btn.getAttribute("data-cart-id");
      const productId = btn.getAttribute("data-product-id");
      await eliminarProducto(cartId, productId);
    });
  });

  // Escuchar evento de clic para el botón de vaciar carrito
  const vaciarCarritoBtn = document.getElementById("vaciarCarritoBtn");
  if (vaciarCarritoBtn) {
    vaciarCarritoBtn.addEventListener("click", async () => {
      const cartId = vaciarCarritoBtn.getAttribute("data-cart-id");
      await vaciarCarrito(cartId);
    });
  }
});
