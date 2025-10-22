
// Cargar usuarios registrados desde localStorage

const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const form = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");


form.addEventListener("submit", (e) => {
  e.preventDefault();

  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();

  // Buscar usuario en la lista
  const usuario = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);

  if (usuario) {
    // Guardar sesión activa
    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    mensaje.textContent = "Inicio de sesión exitoso.";
    mensaje.className = "text-success text-center";

    // Redirigir después de un pequeño tiempo
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } else {
    mensaje.textContent = "Usuario o contraseña incorrectos.";
    mensaje.className = "text-danger text-center";
  }
});
