

const eventos = [
  {
    id: 1,
    nombre: "Festival de la Leyenda Vallenata",
    descripcion: "El festival vallenato más importante de Colombia con los mejores exponentes del género.",
    fecha: "2025-04-27",
    departamento: "Cesar",
    municipio: "Valledupar",
    lugar: "Parque de la Leyenda Vallenata",
    artistas: "Jorge Celedón, Silvestre Dangond, Diomedes Díaz Jr.",
    precioMinimo: 120000,
    imagen: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
    localidades: [
      { nombre: "General", disponibles: 500, precio: 120000 },
      { nombre: "VIP", disponibles: 200, precio: 200000 },
      { nombre: "Platino", disponibles: 100, precio: 300000 },
    ]
  },
  {
    id: 2,
    nombre: "Feria de las Flores",
    descripcion: "La celebración más colorida de Medellín con desfiles, conciertos y eventos culturales.",
    fecha: "2025-08-06",
    departamento: "Antioquia",
    municipio: "Medellín",
    lugar: "Parque Norte",
    artistas: "Maluma, Karol G, J Balvin",
    precioMinimo: 150000,
    imagen: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    localidades: [
      { nombre: "General", disponibles: 800, precio: 150000 },
      { nombre: "Preferencial", disponibles: 300, precio: 250000 },
      { nombre: "VIP", disponibles: 100, precio: 350000 },
    ]
  },
  {
    id: 3,
    nombre: "Carnaval de Barranquilla",
    descripcion: "Patrimonio de la Humanidad, el carnaval más grande de Colombia con música, danza y cultura caribeña.",
    fecha: "2025-02-21",
    departamento: "Atlántico",
    municipio: "Barranquilla",
    lugar: "Vía 40",
    artistas: "Joe Arroyo Orchestra, Totó la Momposina, Systema Solar",
    precioMinimo: 80000,
    imagen: "https://images.unsplash.com/photo-1506157786151-b8491531f063",
    localidades: [
      { nombre: "Palco", disponibles: 150, precio: 80000 },
      { nombre: "VIP", disponibles: 50, precio: 200000 },
      { nombre: "Súper Palco", disponibles: 25, precio: 350000 },
    ]
  }
];

// ---------------------------
// 2️⃣ REFERENCIAS DEL DOM
// ---------------------------
const contenedorEventos = document.getElementById("eventosContainer");
const inputNombre = document.getElementById("buscarNombre");
const selectDepartamento = document.getElementById("buscarDepartamento");
const selectMunicipio = document.getElementById("buscarMunicipio");
const inputFecha = document.getElementById("buscarFecha");
const btnBuscar = document.getElementById("btnBuscar");
const btnLimpiar = document.getElementById("btnLimpiar");

// ---------------------------
// 3️⃣ FUNCIÓN: Mostrar eventos
// ---------------------------
function mostrarEventos(listaEventos) {
  contenedorEventos.innerHTML = "";

  if (listaEventos.length === 0) {
    contenedorEventos.innerHTML = `
      <div class="text-center text-muted py-5">
        <i class="bi bi-emoji-frown display-4"></i>
        <p class="mt-3">No se encontraron eventos con esos criterios.</p>
      </div>`;
    return;
  }

  listaEventos.forEach((evento, index) => {
    const card = document.createElement("div");
    card.classList.add("col-lg-4", "col-md-6", "mb-4");

    // ID único para cada acordeón (para evitar colisiones)
    const idCollapse = `collapseLocalidades${index}`;

    // HTML de localidades (se muestra al desplegar)
    const localidadesHTML = evento.localidades.map(loc => `
      <li class="d-flex justify-content-between small border-bottom py-1">
        <span>${loc.nombre}</span>
        <span class="text-success fw-semibold">${loc.disponibles} disponibles</span>
      </li>
    `).join("");

    card.innerHTML = `
      <div class="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
        <div class="position-relative">
          <img src="${evento.imagen}" class="card-img-top" alt="${evento.nombre}">
          <span class="badge bg-warning text-dark position-absolute top-0 end-0 m-3">Disponible</span>
        </div>
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 class="fw-bold">${evento.nombre}</h5>
            <p class="text-muted small">${evento.descripcion.substring(0, 90)}...</p>

            <p class="mb-1"><i class="bi bi-calendar-event me-2 text-primary"></i>${formatearFecha(evento.fecha)}</p>
            <p class="mb-1"><i class="bi bi-geo-alt me-2 text-danger"></i>${evento.lugar}</p>
            <p class="mb-2"><i class="bi bi-music-note-beamed me-2 text-success"></i>${evento.artistas}</p>
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
              <p class="fw-bold text-primary mb-0">Desde $${evento.precioMinimo.toLocaleString()}</p>
              <button class="btn btn-sm btn-primary">Ver detalles</button>
            </div>
          </div>
        </div>
      </div>
    `;

    contenedorEventos.appendChild(card);
  });
}

// ---------------------------
// 4  FILTRAR EVENTOS
// ---------------------------
function filtrarEventos() {
  const nombre = inputNombre.value.toLowerCase().trim();
  const departamento = selectDepartamento.value;
  const municipio = selectMunicipio.value;
  const fecha = inputFecha.value;

  const filtrados = eventos.filter(e => {
    const coincideNombre = e.nombre.toLowerCase().includes(nombre);
    const coincideDepartamento = departamento === "" || e.departamento === departamento;
    const coincideMunicipio = municipio === "" || e.municipio === municipio;
    const coincideFecha = fecha === "" || e.fecha === fecha;

    return coincideNombre && coincideDepartamento && coincideMunicipio && coincideFecha;
  });

  mostrarEventos(filtrados);
}

// ---------------------------
// 5️ LIMPIAR FILTROS
// ---------------------------
function limpiarFiltros() {
  inputNombre.value = "";
  selectDepartamento.value = "";
  selectMunicipio.value = "";
  inputFecha.value = "";
  mostrarEventos(eventos);
}

// ---------------------------
// 6️ FORMATEAR FECHA
// ---------------------------
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const opciones = { day: "numeric", month: "long", year: "numeric" };
  return fecha.toLocaleDateString("es-CO", opciones);
}

// ---------------------------
// 7️ EVENTOS
// ---------------------------
btnBuscar.addEventListener("click", filtrarEventos);
btnLimpiar.addEventListener("click", limpiarFiltros);
mostrarEventos(eventos);
