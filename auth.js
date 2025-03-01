'use strict';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDqpFisYaQUau6vkv1RpgauSqWK21ir07o",
    authDomain: "proyecto-agricultura-ec.firebaseapp.com",
    projectId: "proyecto-agricultura-ec",
    storageBucket: "proyecto-agricultura-ec.appspot.com",
    messagingSenderId: "335421625",
    appId: "1:335421625:web:8bb9f5061b958047c57b68",
    measurementId: "G-9C5TBF4B0M"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const forgotPasswordLink = document.getElementById("forgot-password-link");
    const logoutBtn = document.getElementById("logout-btn"); // Botón de cerrar sesión

    // Manejo de "Iniciar sesión"
    if (loginBtn) {
        loginBtn.addEventListener("click", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!email || !password) {
                mostrarMensaje("Por favor, complete todos los campos.", "error");
                return;
            }

            console.log("Intentando iniciar sesión con:", email, password); // Depuración

            // Intentar iniciar sesión
            signInWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    console.log("Inicio de sesión exitoso:", userCredential); // Depuración
                    mostrarMensaje("Inicio de sesión exitoso.", "success");
                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 1000);
                })
                .catch(error => {
                    console.error("Error de autenticación:", error); // Depuración
                    mostrarMensaje("Error de autenticación: " + error.message, "error");
                });
        });
    }

    // Manejo de "Registrar"
    if (registerBtn) {
        registerBtn.addEventListener("click", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!email || !password) {
                mostrarMensaje("Por favor, complete todos los campos.", "error");
                return;
            }

            console.log("Intentando registrar usuario con:", email, password); // Depuración

            // Intentar registrar usuario
            createUserWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    console.log("Registro exitoso:", userCredential); // Depuración
                    mostrarMensaje("Registro exitoso.", "success");
                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 1000);
                })
                .catch(error => {
                    console.error("Error de registro:", error); // Depuración
                    mostrarMensaje("Error de registro: " + error.message, "error");
                });
        });
    }

    // Manejo del enlace "Olvidé mi contraseña"
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", function (event) {
            event.preventDefault();
            const email = document.getElementById("email").value.trim();

            if (!email) {
                mostrarMensaje("Por favor, ingrese su correo electrónico para restablecer la contraseña.", "error");
                return;
            }

            console.log("Enviando correo para restablecer la contraseña a:", email); // Depuración

            sendPasswordResetEmail(auth, email)
                .then(() => {
                    mostrarMensaje("Correo de restablecimiento de contraseña enviado.", "success");
                })
                .catch(error => {
                    console.error("Error al enviar el correo de restablecimiento:", error); // Depuración
                    mostrarMensaje("Error al enviar el correo de restablecimiento: " + error.message, "error");
                });
        });
    }

    // Manejo del botón de "Cerrar sesión"
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            signOut(auth)  // Cambié firebase.auth().signOut() a signOut(auth)
                .then(() => {
                    console.log("Sesión cerrada.");
                    window.location.href = "index.html"; // Redirige a la página de login después de cerrar sesión
                })
                .catch((error) => {
                    console.error("Error al cerrar sesión:", error);
                });
        });
    }
});

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    const mensajeBox = document.getElementById("mensaje-box");
    if (mensajeBox) {
        mensajeBox.textContent = mensaje;
        mensajeBox.className = tipo;
        mensajeBox.style.display = "block";
        setTimeout(() => mensajeBox.style.display = "none", 3000);
    } else {
        alert(mensaje);
    }
}
