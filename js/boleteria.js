// Configuración del backend
const API_BASE_URL = 'http://localhost:8080';

// Cargar eventos y localidades desde el backend para llenar los selects
document.addEventListener("DOMContentLoaded", async () => {
  await cargarEventos();
  await cargarLocalidades();
});

// Cargar eventos para el select
async function cargarEventos() {
  const select = document.getElementById("eventoSelect");
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/boleteria/eventos`);
    const eventos = await response.json();

    // Limpiar opciones existentes (excepto la primera)
    select.innerHTML = '<option value="">Seleccione un evento</option>';

    eventos.forEach(evento => {
      const option = document.createElement("option");
      option.value = evento.id;
      option.textContent = `${evento.nombre} - ${evento.fechaInicio}`;
      select.appendChild(option);
    });
    
    console.log(`Cargados ${eventos.length} eventos`);
  } catch (error) {
    console.error("Error cargando eventos:", error);
    alert("No se pudieron cargar los eventos. Verifica que el backend esté ejecutándose.");
  }
}

// Cargar localidades para el select
async function cargarLocalidades() {
  const select = document.getElementById("localidadSelect");
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/boleteria/localidades`);
    const localidades = await response.json();

    // Limpiar opciones existentes (excepto la primera)
    select.innerHTML = '<option value="">Seleccione una localidad</option>';

    localidades.forEach(localidad => {
      const option = document.createElement("option");
      option.value = localidad.id;
      option.textContent = `${localidad.nombreLocalidad} - ${localidad.descripcion || ''}`;
      select.appendChild(option);
    });
    
    console.log(`Cargadas ${localidades.length} localidades`);
  } catch (error) {
    console.error("Error cargando localidades:", error);
    alert("No se pudieron cargar las localidades. Verifica que el backend esté ejecutándose.");
  }
}

// Manejar envío del formulario
document.getElementById("boleteriaForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validar usuario logeado
  const userId = localStorage.getItem('userId');
  if (!userId) {

    if (typeof $ !== 'undefined' && $('#modalRegistro').length) {
      $('#modalRegistro').modal('show');
    } else {
      alert('Debes iniciar sesión o registrarte para comprar.');
    }
    return;
  }

  const eventoId = document.getElementById("eventoSelect").value;
  const localidadId = document.getElementById("localidadSelect").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const cantidadTotal = parseInt(document.getElementById("cantidad").value);

  // Validaciones
  if (!eventoId || !localidadId || !valor || !cantidadTotal) {
    alert("Por favor complete todos los campos");
    return;
  }

  const data = {
    eventoId: eventoId,
    localidadId: localidadId,
    valor: valor,
    cantidadTotal: cantidadTotal,
    userId: userId
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/boleteria/crear`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      alert("Boletería guardada correctamente");
      console.log("Boletería creada:", result);
      e.target.reset();
    } else {
      const errorText = await response.text();
      alert(`Error al guardar boletería: ${errorText}`);
    }
  } catch (error) {
    console.error("Error conectando con el backend:", error);
    alert("No se pudo conectar con el servidor");
  }
});
