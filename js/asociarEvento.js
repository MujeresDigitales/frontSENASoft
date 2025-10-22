// ==========================================================
// Cargar datos desde localStorage 
// ==========================================================
let eventos = JSON.parse(localStorage.getItem("eventos")) || [];
let artistas = JSON.parse(localStorage.getItem("artistas")) || [];

const eventoSelect = document.getElementById("eventoSelect");
const artistaSelect = document.getElementById("artistaSelect");
const mensaje = document.getElementById("mensaje");
const listaEventos = document.getElementById("listaEventos");
const form = document.getElementById("formAsociar");

// ==========================================================
//  Llenar los selects dinámicamente
// ==========================================================
function cargarDatos() {
  eventoSelect.innerHTML = eventos.length
    ? `<option value="">Seleccione un evento</option>`
    : `<option value="">No hay eventos registrados</option>`;

  eventos.forEach(e => {
    eventoSelect.innerHTML += `<option value="${e.id}">${e.nombre}</option>`;
  });

  artistaSelect.innerHTML = artistas.length
    ? `<option value="">Seleccione un artista</option>`
    : `<option value="">No hay artistas registrados</option>`;

  artistas.forEach(a => {
    artistaSelect.innerHTML += `<option value="${a.id}">${a.nombre}</option>`;
  });
}

// ==========================================================
//  Mostrar eventos del artista seleccionado
// ==========================================================
artistaSelect.addEventListener("change", () => {
  const id = Number(artistaSelect.value);
  if (!id) return (listaEventos.textContent = "Selecciona un artista");

  const lista = eventos.filter(e => e.artistas?.includes(id));
  listaEventos.innerHTML = lista.length
    ? lista.map(e => `<p><b>${e.nombre}</b> (${new Date(e.inicio).toLocaleString()})</p>`).join("")
    : "Este artista no tiene eventos asociados.";
});

// ==========================================================
// validar si hay cruce de horarios
// ==========================================================
function hayChoque(artistaId, nuevoEvento) {
  const eventosDelArtista = eventos.filter(e => e.artistas?.includes(artistaId));
  return eventosDelArtista.some(e =>
    new Date(e.inicio) < new Date(nuevoEvento.fin) &&
    new Date(nuevoEvento.inicio) < new Date(e.fin)
  );
}

// ==========================================================
//  Asociar artista al evento seleccionado
// ==========================================================
form.addEventListener("submit", e => {
  e.preventDefault();

  const idEvento = Number(eventoSelect.value);
  const idArtista = Number(artistaSelect.value);

  if (!idEvento || !idArtista) {
    mensaje.textContent = "Selecciona evento y artista.";
    mensaje.className = "text-danger text-center";
    return;
  }

  const evento = eventos.find(e => e.id === idEvento);
  if (!evento.artistas) evento.artistas = [];

  if (hayChoque(idArtista, evento)) {
    mensaje.textContent = "Este artista ya tiene un evento en ese horario.";
    mensaje.className = "text-danger text-center";
  } else {
    evento.artistas.push(idArtista);
    localStorage.setItem("eventos", JSON.stringify(eventos));

    mensaje.textContent = " Artista asociado correctamente.";
    mensaje.className = "text-success text-center";
  }
});


cargarDatos();
