
// Configuración del backend
const API_BASE_URL = 'http://localhost:8080';

// Array temporal para guardar los eventos
let listaEventos = [];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("eventoForm");
  if (form) {
    form.addEventListener("submit", registrarEvento);
  }
  
  // Cargar eventos existentes
  cargarEventos();
});

// Función principal: registrar evento
async function registrarEvento(e) {
  e.preventDefault(); // Evita recargar la página

  // Capturamos los valores de los campos
  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const fechaInicio = document.getElementById("fecha_inicio").value;
  const horaInicio = document.getElementById("hora_inicio").value;
  const fechaFin = document.getElementById("fecha_fin").value;
  const horaFin = document.getElementById("hora_fin").value;

  // Agregar campos faltantes que requiere el backend
  const lugar = document.getElementById("lugar")?.value.trim() || "Por definir";
  const municipio = document.getElementById("municipio")?.value.trim() || "Por definir";
  const departamento = document.getElementById("departamento")?.value.trim() || "Por definir";

  // Validaciones de campos obligatorios
  if (!nombre || !descripcion || !fechaInicio || !horaInicio || !fechaFin || !horaFin) {
    alert("Por favor, completa todos los campos antes de registrar el evento.");
    return;
  }

  // Generar código único para el evento
  const codigo = Date.now(); // Usar timestamp como código único

  // Crear objeto evento según el modelo del backend
  const nuevoEvento = {
    codigo: codigo,
    nombre: nombre,
    descripcion: descripcion,
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    horaInicio: horaInicio,
    horaFin: horaFin,
    lugar: lugar,
    municipio: municipio,
    departamento: departamento
  };

  try {
    // Enviar al backend
    const response = await fetch(`${API_BASE_URL}/eventos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoEvento)
    });

    if (response.ok) {
      const eventoCreado = await response.json();
      
      // Agregar a la lista local
      listaEventos.push(eventoCreado);
      
      // Limpiar formulario
      e.target.reset();
      
      alert("Evento registrado correctamente en el backend!");
      console.log("Evento creado:", eventoCreado);
      
    } else {
      const errorText = await response.text();
      alert(`Error al crear el evento: ${errorText}`);
    }
    
  } catch (error) {
    console.error("Error conectando con el backend:", error);
    alert("No se pudo conectar con el servidor. Verifica que esté ejecutándose en http://localhost:8080");
  }
}

// Cargar eventos desde el backend
async function cargarEventos() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/boleteria/eventos`);
    if (response.ok) {
      listaEventos = await response.json();
      mostrarEventos();
    } else {
      console.log("No se pudieron cargar eventos del backend");
    }
  } catch (error) {
    console.log("Backend no disponible, usando datos locales");
    // Intentar cargar desde localStorage como fallback
    const guardados = localStorage.getItem("eventos");
    if (guardados) {
      listaEventos = JSON.parse(guardados);
      mostrarEventos();
    }
  }
}

// Mostrar los eventos en la consola 
function mostrarEventos() {
  console.clear();
  console.log("Eventos registrados:");
  console.table(listaEventos);
}
