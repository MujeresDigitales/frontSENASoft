// Configuración del backend
const API_BASE_URL = 'http://localhost:8080';

// Array para almacenar localidades
let listaLocalidades = [];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("localidadForm");
  if (form) {
    form.addEventListener("submit", crearLocalidad);
  }
  
  // Cargar localidades existentes
  cargarLocalidades();
});

// Función para crear localidad
async function crearLocalidad(e) {
  e.preventDefault();

  const codigo = document.getElementById("codigo").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();

  // Validaciones
  if (!codigo || !nombre || !descripcion) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const nuevaLocalidad = {
    codigoLocalidad: codigo,
    nombreLocalidad: nombre,
    descripcion: descripcion
  };

  try {
    const response = await fetch(`${API_BASE_URL}/localidades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaLocalidad)
    });

    if (response.ok) {
      const localidadCreada = await response.json();
      
      // Agregar a la lista local
      listaLocalidades.push(localidadCreada);
      
      // Limpiar formulario
      e.target.reset();
      
      alert("Localidad registrada correctamente!");
      console.log("Localidad creada:", localidadCreada);
      
      // Actualizar tabla
      mostrarLocalidades();
      
    } else {
      const errorText = await response.text();
      alert(`Error al crear la localidad: ${errorText}`);
    }
    
  } catch (error) {
    console.error("Error conectando con el backend:", error);
    alert("No se pudo conectar con el servidor. Verifica que esté ejecutándose en http://localhost:8080");
  }
}

// Cargar localidades desde el backend
async function cargarLocalidades() {
  try {
    const response = await fetch(`${API_BASE_URL}/localidades`);
    if (response.ok) {
      listaLocalidades = await response.json();
      mostrarLocalidades();
    } else {
      console.log("No se pudieron cargar localidades del backend");
    }
  } catch (error) {
    console.log("Backend no disponible");
  }
}

// Mostrar localidades en la tabla
function mostrarLocalidades() {
  const tbody = document.getElementById("localidadesTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  listaLocalidades.forEach(localidad => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${localidad.codigoLocalidad}</td>
      <td>${localidad.nombreLocalidad}</td>
      <td>${localidad.descripcion || 'Sin descripción'}</td>
    `;
    tbody.appendChild(row);
  });

  console.log(`Mostrando ${listaLocalidades.length} localidades`);
}