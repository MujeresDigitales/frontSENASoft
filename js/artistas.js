const API_BASE_URL = 'http://localhost:8080';

// Cargar eventos al iniciar
window.addEventListener('DOMContentLoaded', cargarEventos);

async function cargarEventos() {
  const select = document.getElementById('eventoSelect');
  if (!select) return;
  try {
    const response = await fetch(`${API_BASE_URL}/api/boleteria/eventos`);
    const eventos = await response.json();
    select.innerHTML = '<option value="">Seleccione evento</option>';
    eventos.forEach(ev => {
      const option = document.createElement('option');
      option.value = ev.id;
      option.textContent = `${ev.nombre} (${ev.fechaInicio})`;
      select.appendChild(option);
    });
  } catch (err) {
    select.innerHTML = '<option value="">No se pudieron cargar eventos</option>';
    console.error('Error cargando eventos:', err);
  }
}

// Cargar artistas al iniciar
window.addEventListener('DOMContentLoaded', cargarArtistasConEvento);

async function cargarArtistasConEvento() {
  const tbody = document.getElementById('artistasTableBody');
  if (!tbody) return;
  try {
    const response = await fetch(`${API_BASE_URL}/api/artistas/con-evento`);
    const artistas = await response.json();
    tbody.innerHTML = '';
    artistas.forEach(artista => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${artista.codigo}</td>
        <td>${artista.nombreArtista}</td>
        <td>${artista.generoMusical}</td>
        <td>${artista.ciudadOrigen}</td>
        <td>${artista.nombreEvento || 'Sin evento'}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error cargando artistas:', err);
    tbody.innerHTML = '<tr><td colspan="5">No se pudieron cargar los artistas</td></tr>';
  }
}

// Al registrar un artista, recargar la tabla
document.getElementById('artistaForm')?.addEventListener('submit', function() {
  setTimeout(cargarArtistasConEvento, 500);
});

// Manejar envío del formulario de artista
const form = document.getElementById('artistaForm');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const codigo = document.getElementById('codigo').value.trim();
    const eventoId = document.getElementById('eventoSelect').value;
    const nombreArtista = document.getElementById('nombres').value.trim();
    const generoMusical = document.getElementById('genero').value;
    const ciudadOrigen = document.getElementById('ciudad').value.trim();

    if (!codigo || !eventoId || !nombreArtista || !generoMusical || !ciudadOrigen) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Enviar al backend
    const artista = {
      codigo: codigo,
      nombreArtista: nombreArtista,
      generoMusical: generoMusical,
      ciudadOrigen: ciudadOrigen,
      eventoId: eventoId // Enviar el id del evento seleccionado
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/artistas/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artista)
      });
      if (response.ok) {
        alert('Artista registrado correctamente');
        form.reset();
      } else {
        const errorText = await response.text();
        alert('Error al registrar artista: ' + errorText);
      }
    } catch (err) {
      alert('No se pudo conectar con el servidor');
      console.error(err);
    }
  });
}
