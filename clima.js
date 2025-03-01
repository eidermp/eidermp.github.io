'use strict';

const apiKey = '634c44f6b412402884728a784d0b1191';


// URL base de la API de OpenWeatherMap
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";

// Función para obtener información meteorológica
function obtenerInformacionMeteorologica() {
    // Obtener la ubicación actual (geolocalización del navegador)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Construir la URL para la solicitud de la API con la latitud y longitud
            const url = `${weatherUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

            // Realizar la solicitud fetch a la API
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data); // Depuración

                    // Mostrar la información en el DOM
                    const descripcion = data.weather[0].description;
                    const temperatura = data.main.temp;
                    const humedad = data.main.humidity;

                    // Actualizar la interfaz con los datos obtenidos
                    document.getElementById("weather-description").textContent = `Descripción: ${descripcion}`;
                    document.getElementById("temperature").textContent = `Temperatura: ${temperatura}°C`;
                    document.getElementById("humidity").textContent = `Humedad: ${humedad}%`;
                })
                .catch(error => {
                    console.error("Error al obtener los datos meteorológicos:", error);
                    mostrarMensaje("No se pudo obtener la información meteorológica.", "error");
                });
        }, function(error) {
            console.error("Error de geolocalización:", error);
            mostrarMensaje("No se pudo obtener tu ubicación.", "error");
        });
    } else {
        console.error("Geolocalización no soportada en este navegador.");
        mostrarMensaje("La geolocalización no está soportada por tu navegador.", "error");
    }
}

// Llamar a la función cuando el contenido esté cargado
document.addEventListener("DOMContentLoaded", function () {
    obtenerInformacionMeteorologica();
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