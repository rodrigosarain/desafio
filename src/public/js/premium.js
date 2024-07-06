document.addEventListener("DOMContentLoaded", () => {
  // Manejar la solicitud POST del formulario de productos
  document
    .getElementById("productForm")
    ?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const productData = {};
      formData.forEach((value, key) => {
        productData[key] = value;
      });
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      if (response.ok) {
        event.target.reset();
      }
    });

  // Manejar actualizaciones en tiempo real de la lista de productos
  socket.on("productos", (productos) => {
    const productList = document.getElementById("userProductsList");
    if (productList) {
      productList.innerHTML = "";
      productos.forEach((product) => {
        const newItem = document.createElement("li");
        newItem.innerHTML = `
              <h3>${product.title}</h3>
              <p>${product.description}</p>
              <p>Precio: $${product.price}</p>
              <form class="deleteForm" data-product-id="${product._id}">
                <button type="button" class="deleteButton">Eliminar</button>
              </form>
            `;
        productList.appendChild(newItem);
      });
    }
  });

  // Manejar la eliminación de productos
  document
    .getElementById("userProductsList")
    ?.addEventListener("click", async (event) => {
      if (event.target.classList.contains("deleteButton")) {
        const productId = event.target.parentElement.dataset.productId;
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          event.target.parentElement.parentElement.remove();
        }
      }
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const premiumForm = document.getElementById("premiumForm");
  premiumForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const userId = document.getElementById("uid").value; // Obtén el _id del usuario

    try {
      const response = await fetch(`/api/users/premium/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }), // Enviar userId en el cuerpo de la solicitud
      });

      if (response.ok) {
        alert("Cambio a premium completado");
        window.location.href = "/panel-premium";
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error al cambiar a premium:", error.message);
      alert("Error al cambiar a premium. Inténtelo de nuevo más tarde.");
    }
  });
});
