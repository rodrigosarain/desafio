document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll("#eliminar");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();

      const userId = button.dataset.userId; // Assuming you set data-user-id attribute in your handlebars file

      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Error al eliminar usuario");
        }

        const data = await response.json();
        console.log(data);

        // Show alert that user was deleted successfully
        alert("Usuario eliminado correctamente");

        button.closest("tr").remove(); // Remove the row from the table
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
});
