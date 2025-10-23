
// . Validar si el usuario está autenticado

const usuarioAutenticado = JSON.parse(localStorage.getItem("usuarioActivo"));
const alertaSesion = document.getElementById("alertaSesion");
const filtros = document.getElementById("filtros");
const tablaHistorial = document.getElementById("tablaHistorial");
const cuerpoHistorial = document.getElementById("cuerpoHistorial");
const sinCompras = document.getElementById("sinCompras");

if (!usuarioAutenticado) {
  alertaSesion.classList.remove("d-none");
  alertaSesion.textContent = "Debes iniciar sesión para ver tu historial.";
  
  setTimeout(() => {
    window.location.href = "login.html";
  }, 3000);
} else {
  filtros.classList.remove("d-none");
  tablaHistorial.classList.remove("d-none");
  cargarHistorial();
}



// . Cargar historial de compras del usuario autenticado

function cargarHistorial() {
  const compras = JSON.parse(localStorage.getItem("compras")) || [];
  const misCompras = compras.filter(c => c.comprador === usuarioAutenticado.nombre);

  if (misCompras.length === 0) {
    sinCompras.classList.remove("d-none");
    return;
  }

  mostrarCompras(misCompras);

  // Filtros
  const buscarEvento = document.getElementById("buscarEvento");
  const filtrarFecha = document.getElementById("filtrarFecha");

  buscarEvento.addEventListener("input", () => filtrarCompras(misCompras));
  filtrarFecha.addEventListener("change", () => filtrarCompras(misCompras));
}



//  Mostrar compras en la tabla

function mostrarCompras(lista) {
  cuerpoHistorial.innerHTML = "";

  lista.forEach(compra => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${compra.evento}</td>
      <td>${compra.localidad}</td>
      <td>${compra.cantidad}</td>
      <td>$ ${compra.valorTotal.toLocaleString()}</td>
      <td>${compra.fechaHora}</td>
      <td>
        <span class="badge ${compra.estado === 'Exitosa' ? 'bg-success' : 'bg-secondary'}">
          ${compra.estado}
        </span>
      </td>
    `;
    cuerpoHistorial.appendChild(fila);
  });
}



// . Filtrar por nombre de evento o fecha

function filtrarCompras(compras) {
  const texto = document.getElementById("buscarEvento").value.toLowerCase();
  const fecha = document.getElementById("filtrarFecha").value;

  const filtradas = compras.filter(c => {
    const coincideEvento = c.evento.toLowerCase().includes(texto);
    const coincideFecha = fecha ? c.fechaHora.startsWith(fecha) : true;
    return coincideEvento && coincideFecha;
  });

  mostrarCompras(filtradas);

  if (filtradas.length === 0) {
    cuerpoHistorial.innerHTML = `
      <tr>
        <td colspan="6" class="text-muted">No se encontraron compras con esos filtros.</td>
      </tr>
    `;
  }
}
