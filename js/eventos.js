
// Array temporal para guardar los eventos
let listaEventos = [];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("eventoForm");
  form.addEventListener("submit", registrarEvento);

  // Cargar los eventos guardados anteriormente
});

// Función principal: registrar evento
function registrarEvento(e) {
  e.preventDefault(); // Evita recargar la página

  // Capturamos los valores de los campos
  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const fechaInicio = document.getElementById("fecha_inicio").value;
  const horaInicio = document.getElementById("hora_inicio").value;
  const fechaFin = document.getElementById("fecha_fin").value;
  const horaFin = document.getElementById("hora_fin").value;

  // Validaciones de campos obligatorios
  if (!nombre || !descripcion || !fechaInicio || !horaInicio || !fechaFin || !horaFin) {
    alert(" Por favor, completa todos los campos antes de registrar el evento.");
    return;
  }

  // Crear objeto evento
  const nuevoEvento = {
    id: listaEventos.length + 1,
    nombre,
    descripcion,
    fechaInicio,
    horaInicio,
    fechaFin,
    horaFin
  };

  // Guardar en el array
  listaEventos.push(nuevoEvento);

  // Guardar en localStorage (persistencia local)
  localStorage.setItem("eventos", JSON.stringify(listaEventos));

  // Limpiar formulario
  e.target.reset();

  alert("Evento registrado correctamente.");
  mostrarEventos(); // Muestra la lista actualizada
}

// Mostrar los eventos en la consola 
function mostrarEventos() {
  console.clear();
  console.log("Eventos registrados:");
  console.table(listaEventos);
}

// Cargar eventos guardados en localStorage
function cargarEventos() {
  const guardados = localStorage.getItem("eventos");
  if (guardados) {
    listaEventos = JSON.parse(guardados);
    mostrarEventos();
  }
}
