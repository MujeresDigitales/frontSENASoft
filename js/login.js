
const API_BASE_URL = 'http://localhost:8080';
const form = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();

  const loginData = {
    email: email,
    contrasena: contrasena
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData)
    });

    if (response.ok) {
      const usuario = await response.json();
      localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
      localStorage.setItem("userId", usuario.id); // Para el flujo de compra
      mensaje.textContent = "Inicio de sesión exitoso.";
      mensaje.className = "text-success text-center";
        setTimeout(() => {
          window.location.href = "eventos/consultaEventos.html";
        }, 1000);
    } else {
      mensaje.textContent = "Usuario o contraseña incorrectos.";
      mensaje.className = "text-danger text-center";
    }
  } catch (error) {
    mensaje.textContent = "No se pudo conectar con el servidor.";
    mensaje.className = "text-danger text-center";
  }
});