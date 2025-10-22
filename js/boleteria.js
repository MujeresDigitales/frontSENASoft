// Cargar eventos desde el backend para llenar el select
document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("eventoSelect");

  try {
    const res = await fetch("http://localhost:8080/api/eventos");
    const eventos = await res.json();

    eventos.forEach(e => {
      const option = document.createElement("option");
      option.value = e.id; // o _id si usas MongoDB
      option.textContent = e.nombre;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error cargando eventos:", err);
    alert("No se pudieron cargar los eventos");
  }
});

// Manejar envío del formulario
document.getElementById("boleteriaForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    eventoId: document.getElementById("eventoSelect").value,
    localidad: document.getElementById("localidad").value,
    valor: parseFloat(document.getElementById("valor").value),
    cantidad: parseInt(document.getElementById("cantidad").value),
  };

  try {
    const res = await fetch("http://localhost:8080/api/boleteria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Boletería guardada correctamente");
      e.target.reset();
    } else {
      alert("Error al guardar boletería");
    }
  } catch (err) {
    console.error(err);
    alert("No se pudo conectar con el servidor");
  }
});
