'use strict';

let model; // Variable para almacenar el modelo de MobileNet
let currentStream; // Variable para almacenar la transmisión de video actual

// Función para cargar el modelo MobileNet
async function loadModel() {
    model = await mobilenet.load(); // Carga el modelo de MobileNet
    console.log("Modelo cargado"); // Mensaje de confirmación en la consola
}

// Función para analizar una imagen
async function analyzeImage(imageElement) {
    const tensor = tf.browser.fromPixels(imageElement) // Convierte la imagen a un tensor
        .resizeNearestNeighbor([224, 224]) // Redimensiona la imagen a 224x224 píxeles
        .toFloat() // Convierte los valores a tipo float
        .expandDims(); // Agrega una dimensión extra para que sea compatible con el modelo
    const predictions = await model.classify(tensor); // Clasifica la imagen
    return predictions; // Devuelve las predicciones
}

// Función para capturar una imagen desde la cámara
async function handleCapture() {
    const canvas = document.getElementById('snapshot'); // Obtiene el elemento canvas
    const ctx = canvas.getContext('2d'); // Obtiene el contexto 2D del canvas
    canvas.width = video.videoWidth; // Establece el ancho del canvas
    canvas.height = video.videoHeight; // Establece la altura del canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Dibuja la imagen del video en el canvas
    const predictions = await analyzeImage(canvas); // Analiza la imagen capturada
    displayResults(predictions); // Muestra los resultados de la clasificación
}

// Función para manejar la carga de una imagen desde un archivo
async function handleUpload(event) {
    const file = event.target.files[0]; // Obtiene el primer archivo seleccionado
    if (file && file.type.startsWith('image/')) { // Verifica que sea un archivo de imagen
        const img = new Image(); // Crea un nuevo objeto de imagen
        img.src = URL.createObjectURL(file); // Crea una URL para el archivo de imagen
        img.onload = async () => { // Cuando la imagen se carga
            const predictions = await analyzeImage(img); // Analiza la imagen
            displayResults(predictions); // Muestra los resultados
        };
    } else {
        alert("Por favor, selecciona un archivo de imagen válido."); // Mensaje de advertencia
    }
}

// Función para mostrar los resultados de la clasificación
function displayResults(predictions) {
    const resultDiv = document.getElementById('result'); // Obtiene el div para mostrar resultados
    resultDiv.innerHTML = predictions.map(p => `${p.className}: ${(p.probability * 100).toFixed(2)}%`).join('<br>'); // Muestra cada clase y su probabilidad
}

// Función para inicializar la cámara
async function initCamera(deviceId) {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop()); // Detiene la transmisión actual si existe
    }

    const video = document.getElementById('camera'); // Obtiene el elemento de video
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } } // Solicita acceso a la cámara especificada
        });
        video.srcObject = stream; // Asigna la transmisión al elemento de video
        currentStream = stream; // Guarda la transmisión actual
    } catch (error) {
        console.error("Error al acceder a la cámara: ", error); // Muestra el error en la consola
        alert("No se pudo acceder a la cámara. Verifica los permisos."); // Mensaje de advertencia
    }
}

// Función para listar dispositivos de video disponibles
async function listVideoDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices(); // Enumera todos los dispositivos multimedia
    const cameraSelect = document.getElementById('cameraSelect'); // Obtiene el elemento select para cámaras

    devices.forEach(device => {
        if (device.kind === 'videoinput') { // Solo procesa dispositivos de entrada de video
            const option = document.createElement('option'); // Crea una nueva opción
            option.value = device.deviceId; // Establece el valor de la opción como el ID del dispositivo
            option.textContent = device.label || `Cámara ${cameraSelect.length + 1}`; // Establece el texto de la opción
            cameraSelect.appendChild(option); // Agrega la opción al select
        }
    });

    if (cameraSelect.options.length > 0) {
        cameraSelect.value = cameraSelect.options[0].value; // Selecciona la primera cámara disponible
        initCamera(cameraSelect.value); // Inicializa la cámara
    } else {
        alert("No se encontraron cámaras disponibles."); // Mensaje de advertencia
    }
}

// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", async () => {
    await loadModel(); // Carga el modelo MobileNet
    await listVideoDevices(); // Lista las cámaras disponibles

    const cameraSelect = document.getElementById('cameraSelect'); // Obtiene el select de cámaras
    cameraSelect.addEventListener('change', () => {
        initCamera(cameraSelect.value); // Cambia la cámara al seleccionar una nueva
    });

    document.getElementById('capture').addEventListener('click', handleCapture); // Captura la imagen al hacer clic en el botón

    // Corregir el evento del botón "Subir y Analizar"
    document.getElementById('upload').addEventListener('click', () => {
        document.getElementById('fileInput').click(); // Simula un clic en el input de archivo
    });

    document.getElementById('fileInput').addEventListener('change', handleUpload); // Maneja la carga de un archivo
});
