// Cargar usuarios existentes
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const form = document.getElementById("registerForm");
const mensaje = document.getElementById("mensaje");

// Escuchar submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  registrarUsuario();
});

function registrarUsuario() {
  // Capturar valores
  const nombres = document.getElementById("nombres").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const tipoDoc = document.getElementById("tipo_documento").value;
  const numDoc = document.getElementById("numero_documento").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();
  const confirmarContrasena = document.getElementById("confirmar_contrasena").value.trim();
  const telefono = document.getElementById("telefono").value.trim();

  // Validación 1: Contraseñas coinciden
  if (contrasena !== confirmarContrasena) {
    mensaje.textContent = "Las contraseñas no coinciden";
    mensaje.className = "text-danger text-center mt-2 fw-bold";
    return;
  }

  // Validación 2: Contraseña mínimo 4 caracteres
  if (contrasena.length < 4) {
    mensaje.textContent = "La contraseña debe tener al menos 4 caracteres";
    mensaje.className = "text-danger text-center mt-2 fw-bold";
    return;
  }

  // Validación 3: Correo único
  const correoExiste = usuarios.find(u => u.correo === correo);
  if (correoExiste) {
    mensaje.textContent = "Este correo ya está registrado";
    mensaje.className = "text-danger text-center mt-2 fw-bold";
    return;
  }

  // Validación 4: Documento único
  const docExiste = usuarios.find(u => u.numeroDocumento === numDoc);
  if (docExiste) {
    mensaje.textContent = "Este número de documento ya está registrado";
    mensaje.className = "text-danger text-center mt-2 fw-bold";
    return;
  }

  // Crear nuevo usuario
  const nuevoUsuario = {
    nombres: nombres,
    apellidos: apellidos,
    tipoDocumento: tipoDoc,
    numeroDocumento: numDoc,
    correo: correo,
    contrasena: contrasena,
    telefono: telefono || "",
    rol: "comprador",
    fechaRegistro: new Date().toISOString()
  };

  // Guardar
  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  // Mensaje éxito
  mensaje.textContent = "¡Registro exitoso!";
  mensaje.className = "text-success text-center mt-2 fw-bold";
  
  form.reset();

  // Redirigir
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}