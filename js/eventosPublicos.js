const API_BASE_URL = 'http://localhost:8080';

// CONSULTA A LA API
async function cargarMunicipios() {
  try {
    const resp = await fetch(`${API_BASE_URL}/eventos/municipios`);
    if (!resp.ok) throw new Error("Error consultando municipios");
    const municipios = await resp.json();
    selectMunicipio.innerHTML = '<option value="">Municipio</option>' + municipios.map(m => `<option value="${m}">${m}</option>`).join("");
  } catch (err) {
    console.error(err);
  }
}

async function cargarDepartamentos() {
  try {
    const resp = await fetch(`${API_BASE_URL}/eventos/departamentos`);
    if (!resp.ok) throw new Error("Error consultando departamentos");
    const departamentos = await resp.json();
    selectDepartamento.innerHTML = '<option value="">Departamento</option>' + departamentos.map(d => `<option value="${d}">${d}</option>`).join("");
  } catch (err) {
    console.error(err);
  }
}

async function obtenerEventos({nombre = "", departamento = "", municipio = "", fecha = ""} = {}) {
  const params = new URLSearchParams();
  if (fecha) params.append("fecha", fecha);
  if (municipio) params.append("municipio", municipio);
  if (departamento) params.append("departamento", departamento);
  const url = `/api/boleteria/consulta-eventos?${params.toString()}`;
  try {
    const resp = await fetch(`${API_BASE_URL}${url}`);
    if (!resp.ok) throw new Error("Error consultando eventos");
    const eventos = await resp.json();
    if (nombre) {
      return eventos.filter(e => e.nombre.toLowerCase().includes(nombre.toLowerCase()));
    }
    return eventos;
  } catch (err) {
    console.error(err);
    return [];
  }
}


const contenedorEventos = document.getElementById("eventosContainer");
const inputNombre = document.getElementById("buscarNombre");
const selectDepartamento = document.getElementById("buscarDepartamento");
const selectMunicipio = document.getElementById("buscarMunicipio");
const inputFecha = document.getElementById("buscarFecha");
const btnBuscar = document.getElementById("btnBuscar");
const btnLimpiar = document.getElementById("btnLimpiar");


function mostrarEventos(listaEventos) {
  contenedorEventos.innerHTML = "";

  if (listaEventos.length === 0) {
    contenedorEventos.innerHTML = `
      <div class="text-center text-muted py-5">
        <i class="bi bi-emoji-frown display-4"></i>
        <p class="mt-3">No se encontraron eventos con esos filtros  .</p>
      </div>`;
    return;
  }

  listaEventos.forEach((evento, index) => {
    const card = document.createElement("div");
    card.classList.add("col-lg-4", "col-md-6", "mb-4");
    const idCollapse = `collapseLocalidades${index}`;
    const localidadesHTML = (evento.localidades || []).map(loc => `
      <li class="d-flex justify-content-between small border-bottom py-1">
        <span>${loc.nombre}</span>
        <span class="text-success fw-semibold">${loc.boletasDisponibles} disponibles</span>
      </li>
    `).join("");
    card.innerHTML = `
      <div class="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
        <div class="position-relative">
          <img src="${evento.imagen || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3'}" class="card-img-top" alt="${evento.nombre}">
          <span class="badge bg-warning text-dark position-absolute top-0 end-0 m-3">Disponible</span>
        </div>
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 class="fw-bold">${evento.nombre}</h5>
            <p class="text-muted small">${evento.descripcion || ''}</p>
            <p class="mb-1"><i class="bi bi-clock me-2 text-primary"></i>${formatearFecha(evento.fechaInicio)} ${evento.horario || ''}</p>
            <p class="mb-1"><i class="bi bi-geo-alt me-2 text-danger"></i>${evento.lugar || ''} <span class="text-secondary">${evento.municipio || ''}</span></p>
            <p class="mb-2"><i class="bi bi-music-note-beamed me-2 text-success"></i>
              ${(evento.artistas || []).map(a => a.nombreArtista).join(', ')}
            </p>
          </div>
          <div class="mt-3">
            <button class="btn btn-outline-primary w-100 mb-2" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#${idCollapse}">
              Ver boletas por localidad
            </button>
            <div class="collapse" id="${idCollapse}">
              <ul class="list-unstyled mb-3">${localidadesHTML}</ul>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <p class="fw-bold text-primary mb-0">${evento.localidades && evento.localidades.length > 0 ? `Desde $${evento.localidades[0].valor.toLocaleString()}` : ''}</p>
              <button class="btn btn-sm btn-primary btn-comprar">Comprar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    contenedorEventos.appendChild(card);

    // Agregar funcionalidad al botón comprar
    const btnComprar = card.querySelector('.btn-comprar');
    btnComprar.addEventListener('click', function() {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        window.location.href = '../register.html';
      } else {
        alert('Usuario autenticado, puedes continuar con la compra.');
        window.location.href = '../consultaEvento.html'
      }
    });
  });
}

// FILTRAR EVENTOS

async function filtrarEventos() {
  const nombre = inputNombre.value.trim();
  const departamento = selectDepartamento.value;
  const municipio = selectMunicipio.value;
  const fecha = inputFecha.value;
  const eventos = await obtenerEventos({nombre, departamento, municipio, fecha});
  mostrarEventos(eventos);
}

// LIMPIAR FILTROS
function limpiarFiltros() {
  inputNombre.value = "";
  selectDepartamento.value = "";
  selectMunicipio.value = "";
  inputFecha.value = "";
  filtrarEventos();
}

// FORMATEAR FECHA

function formatearFecha(fechaISO) {
  if (!fechaISO) return "";
  const fecha = new Date(fechaISO);
  const opciones = { day: "numeric", month: "long", year: "numeric" };
  return fecha.toLocaleDateString("es-CO", opciones);
}

// EVENTOS
btnBuscar.addEventListener("click", filtrarEventos);
btnLimpiar.addEventListener("click", limpiarFiltros);
cargarMunicipios();
cargarDepartamentos();
filtrarEventos();
