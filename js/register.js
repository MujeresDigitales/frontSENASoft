const API_BASE_URL = 'http://localhost:8080';
const form = document.getElementById("registerForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Capturar valores
  const nombres = document.getElementById("nombres").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const tipoDoc = document.getElementById("tipo_documento").value;
  const numDoc = document.getElementById("numero_documento").value.trim();
  const correo = document.getElementById("email").value.trim();
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

  // Crear usuario para backend
  const nuevoUsuario = {
    nombreUsuario: nombres,
    apellidosUsuario: apellidos,
    tipoDocumento: tipoDoc,
    numeroDocumento: numDoc,
    email: correo,
    contrasena: contrasena,
    confirmarContrasena: confirmarContrasena,
    telefono: telefono
   
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario)
    });

    if (response.ok) {
      mensaje.textContent = "¡Registro exitoso!";
      mensaje.className = "text-success text-center mt-2 fw-bold";
      form.reset();
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      const errorText = await response.text();
      mensaje.textContent = `Error: ${errorText}`;
      mensaje.className = "text-danger text-center mt-2 fw-bold";
    }
  } catch (error) {
    mensaje.textContent = "No se pudo conectar con el servidor";
    mensaje.className = "text-danger text-center mt-2 fw-bold";
  }
});