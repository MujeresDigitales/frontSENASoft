


const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
const alertaSesion = document.getElementById('alertaSesion');
const formCompra = document.getElementById('formCompra');

// Si el usuario NO ha iniciado sesión
if (!usuarioActivo) {
  alertaSesion.classList.remove('d-none');
  formCompra.classList.add('d-none');

  // Redirige automáticamente al login después de 2 segundos
  setTimeout(() => {
    window.location.href = '../login.html';
  }, 2000);
} else {
  // Si hay usuario activo, mostrar formulario
  alertaSesion.classList.add('d-none');
  formCompra.classList.remove('d-none');

  // Autocompletar documento
  const inputDocumento = document.getElementById('documento');
  inputDocumento.value = usuarioActivo.numeroDocumento || '';
  inputDocumento.readOnly = true;
}


// 🎫 DATOS DE EVENTOS Y LOCALIDADES


const eventosData = {
  "1": {
    nombre: "Concierto de Verano",
    localidades: {
      "VIP": { precio: 150000, disponibles: 50 },
      "General": { precio: 80000, disponibles: 200 },
      "Preferencial": { precio: 100000, disponibles: 120 }
    }
  },
  "2": {
    nombre: "Festival de Rock",
    localidades: {
      "VIP": { precio: 120000, disponibles: 30 },
      "General": { precio: 60000, disponibles: 150 },
      "Preferencial": { precio: 90000, disponibles: 80 }
    }
  }
};

// Cargar desde localStorage o usar valores por defecto
let inventarioEventos = JSON.parse(localStorage.getItem('inventarioEventos')) || eventosData;


// 💰 CÁLCULO DE VALOR TOTAL


function calcularTotal() {
  const eventoId = document.getElementById('evento').value;
  const localidad = document.getElementById('localidad').value;
  const cantidad = parseInt(document.getElementById('cantidad').value) || 0;

  if (eventoId && localidad && cantidad > 0) {
    const precio = inventarioEventos[eventoId].localidades[localidad].precio;
    const total = precio * cantidad;
    document.getElementById('valorTotal').value = `$${total.toLocaleString()}`;
  } else {
    document.getElementById('valorTotal').value = '';
  }
}

document.getElementById('evento').addEventListener('change', calcularTotal);
document.getElementById('localidad').addEventListener('change', calcularTotal);
document.getElementById('cantidad').addEventListener('input', calcularTotal);


// ✅ VALIDACIONES DE CAMPOS


// Límite de boletas por transacción
document.getElementById('cantidad').addEventListener('input', function() {
  if (parseInt(this.value) > 10) {
    alert('Máximo 10 boletas por transacción.');
    this.value = 10;
  }
  calcularTotal();
});

// Solo permitir números en tarjeta
document.getElementById('tarjeta').addEventListener('input', function() {
  this.value = this.value.replace(/\D/g, '').slice(0, 15);
});


// 💳 PROCESAR COMPRA


document.getElementById('formCompra').addEventListener('submit', function(e) {
  e.preventDefault();

  const eventoId = document.getElementById('evento').value;
  const localidad = document.getElementById('localidad').value;
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const tarjeta = document.getElementById('tarjeta').value;

  if (!eventoId || !localidad || !cantidad) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  if (tarjeta.length !== 15) {
    alert('El número de tarjeta debe tener exactamente 15 dígitos.');
    return;
  }

  const disponibles = inventarioEventos[eventoId].localidades[localidad].disponibles;
  if (cantidad > disponibles) {
    alert(`Solo quedan ${disponibles} boletas disponibles en ${localidad}.`);
    return;
  }

  const precio = inventarioEventos[eventoId].localidades[localidad].precio;
  const total = precio * cantidad;

  const compra = {
    numeroDocumento: usuarioActivo.numeroDocumento,
    nombreComprador: `${usuarioActivo.nombres} ${usuarioActivo.apellidos}`,
    correoComprador: usuarioActivo.correo,
    evento: inventarioEventos[eventoId].nombre,
    localidad,
    cantidad,
    valorUnitario: precio,
    valorTotal: total,
    numeroTarjeta: tarjeta,
    metodoPago: "Tarjeta de crédito",
    estado: "Exitosa",
    fechaCompra: new Date().toLocaleDateString('es-CO'),
    horaCompra: new Date().toLocaleTimeString('es-CO')
  };

  // Descontar del inventario
  inventarioEventos[eventoId].localidades[localidad].disponibles -= cantidad;
  localStorage.setItem('inventarioEventos', JSON.stringify(inventarioEventos));

  // Guardar compra
  const compras = JSON.parse(localStorage.getItem('compras')) || [];
  compras.push(compra);
  localStorage.setItem('compras', JSON.stringify(compras));

  alert(`✅ Compra realizada con éxito.\n\nEvento: ${compra.evento}\nLocalidad: ${compra.localidad}\nCantidad: ${cantidad}\nTotal: $${total.toLocaleString()}`);

  // Redirigir al historial
  if (confirm('¿Deseas ver tu historial de compras?')) {
    window.location.href = '../historialCompras.html';
  } else {
    this.reset();
    document.getElementById('documento').value = usuarioActivo.numeroDocumento;
  }
});

console.log("✅ Sistema de compra cargado correctamente");
