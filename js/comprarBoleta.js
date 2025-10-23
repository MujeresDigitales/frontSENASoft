// Configuración del backend
const API_BASE_URL = 'http://localhost:8080';

document.addEventListener("DOMContentLoaded", () => {
  // Mostrar el formulario si el usuario está registrado
  const userId = localStorage.getItem('userId');
  const formCompra = document.getElementById("formCompra");
  if (userId && formCompra) {
    formCompra.classList.remove("d-none");
  }

  // Cargar eventos
  cargarEventos();

  // Cuando se seleccione un evento, cargar localidades de ese evento
  document.getElementById("evento").addEventListener("change", function() {
    const eventoId = this.value;
    cargarLocalidades(eventoId);
  });

  // Calcular valor total al cambiar cantidad o localidad
  document.getElementById("cantidad").addEventListener("input", calcularValorTotal);
  document.getElementById("localidad").addEventListener("change", calcularValorTotal);
});

async function cargarEventos() {
  const select = document.getElementById("evento");
  try {
    const response = await fetch(`${API_BASE_URL}/api/boleteria/eventos`);
    const eventos = await response.json();
    select.innerHTML = '<option value="">Seleccione un evento</option>';
    eventos.forEach(evento => {
      const option = document.createElement("option");
      option.value = evento.id;
      option.textContent = `${evento.nombre} - ${evento.fechaInicio}`;
      select.appendChild(option);
    });
  } catch (error) {
    alert("No se pudieron cargar los eventos");
  }
}

async function cargarLocalidades(eventoId) {
  const select = document.getElementById("localidad");
  select.innerHTML = '<option value="">Seleccione una localidad</option>';
  if (!eventoId) return;
  try {
    const response = await fetch(`${API_BASE_URL}/api/boleteria/localidades?eventoId=${eventoId}`);
    const localidades = await response.json();
    localidades.forEach(localidad => {
      const option = document.createElement("option");
      option.value = localidad.id;
      option.textContent = `${localidad.nombreLocalidad}`;
      select.appendChild(option);
    });
  } catch (error) {
    alert("No se pudieron cargar las localidades");
  }
}

async function calcularValorTotal() {
  const localidadId = document.getElementById("localidad").value;
  const cantidad = parseInt(document.getElementById("cantidad").value) || 0;
  let valorUnitario = 0;
  if (localidadId) {
    // Obtener el valor unitario de la localidad desde el backend
    try {
      const response = await fetch(`${API_BASE_URL}/api/boleteria/localidad/${localidadId}`);
      const localidad = await response.json();
      valorUnitario = localidad.valor || 0;
    } catch (error) {
      valorUnitario = 0;
    }
  }
  document.getElementById("valorTotal").value = valorUnitario * cantidad;
}

document.getElementById("formCompra").addEventListener("submit", async function(e) {
  e.preventDefault();
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('Debes iniciar sesión para comprar.');
    return;
  }
  const documento = document.getElementById("documento").value;
  const eventoId = document.getElementById("evento").value;
  const localidadId = document.getElementById("localidad").value;
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const valorTotal = parseFloat(document.getElementById("valorTotal").value);
  if (!documento || !eventoId || !localidadId || !cantidad || !valorTotal) {
    alert("Por favor complete todos los campos");
    return;
  }
  const data = {
    documento,
    eventoId,
    localidadId,
    cantidad,
    valorTotal,
    userId
  };
  try {
    const response = await fetch(`${API_BASE_URL}/api/compra/realizar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      alert("Compra realizada correctamente");
      e.target.reset();
    } else {
      const errorText = await response.text();
      alert(`Error al realizar la compra: ${errorText}`);
    }
  } catch (error) {
    alert("No se pudo conectar con el servidor");
  }
});
