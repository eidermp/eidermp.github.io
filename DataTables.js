"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const table = new DataTable("#data-table", {
        dom: 'Bfrtip',
        buttons: ['copy', 'csv', 'excel', 'print']
    });

    const dataTable = document.querySelector("#data-table");
    dataTable.hidden = true; 
    const ctxTemp = document.getElementById("graficoTemperatura").getContext("2d");
    const ctxPrecip = document.getElementById("graficoPrecipitacion").getContext("2d");
    const ctxViento = document.getElementById("graficoViento").getContext("2d");

    let graficoTemperatura, graficoPrecipitacion, graficoViento;

    document.querySelector("#formulario-datos").addEventListener("submit", async (event) => {
        event.preventDefault();

        const anio = document.querySelector("#anio").value;
        const ciudad = document.querySelector("#ciudad").value.trim();

        if (!ciudad) {
            alert("Por favor, ingresa una ciudad.");
            return;
        }

        try { 
            // 1 Obtener coordenadas de la ciudad
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${ciudad}&count=1&language=es`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) {
                throw new Error("No se encontró la ciudad. Verifica el nombre ingresado.");
            }

            const { latitude, longitude } = geoData.results[0];

            // 2️ Obtener datos históricos del clima
            const startDate = `${anio}-01-01`;
            const endDate = `${anio}-12-31`;
            const weatherUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`;

            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();

            if (!weatherData.daily) {
                throw new Error("No se encontraron datos históricos para esta ciudad y año.");
            }

            procesarDatos(weatherData, ciudad, anio);
        } catch (error) {
            alert(error.message);
        }
    });

    function procesarDatos(data, ciudad, anio) {
        // Limpiar la tabla existente antes de agregar nuevos datos
        table.clear();
    
        // Extraer las fechas y los datos meteorológicos del objeto 'data'
        const fechas = data.daily.time; // Array de fechas diarias
        const tempMaxArr = data.daily.temperature_2m_max; // Array de temperaturas máximas
        const tempMinArr = data.daily.temperature_2m_min; // Array de temperaturas mínimas
        const precipitacionArr = data.daily.precipitation_sum; // Array de precipitaciones totales
        const vientoArr = data.daily.windspeed_10m_max; // Array de velocidades máximas del viento
    
        // Iterar sobre cada fecha y sus datos correspondientes
        fechas.forEach((fecha, index) => {
            // Obtener los valores correspondientes y formatearlos
            const tempMax = tempMaxArr[index]?.toFixed(2) || "N/A"; // Temperatura máxima o "N/A" si no hay dato
            const tempMin = tempMinArr[index]?.toFixed(2) || "N/A"; // Temperatura mínima o "N/A"
            const precipitacion = precipitacionArr[index]?.toFixed(2) || "0.00"; // Precipitación o "0.00" si no hay dato
            const viento = vientoArr[index]?.toFixed(2) || "0.00"; // Velocidad del viento o "0.00"
    
            // Agregar una nueva fila a la tabla con los datos procesados
            table.row.add([ciudad, anio, fecha, tempMax, tempMin, precipitacion, viento]);
        });
    
        // Dibujar la tabla actualizada sin reiniciar la paginación
        table.draw(false);
        dataTable.hidden = false; // Mostrar la tabla en la interfaz
    
        // Actualizar los gráficos con los nuevos datos
        graficoTemperatura = actualizarGrafico(graficoTemperatura, ctxTemp, fechas, tempMaxArr, tempMinArr, "Temperaturas (°C)", "Máx", "Mín");
        graficoPrecipitacion = actualizarGraficoSimple(graficoPrecipitacion, ctxPrecip, fechas, precipitacionArr, "Precipitación (mm)");
        graficoViento = actualizarGraficoSimple(graficoViento, ctxViento, fechas, vientoArr, "Viento (km/h)");
    }
    function actualizarGrafico(grafico, ctx, labels, data1, data2, titulo, label1, label2) {
        // Si ya existe un gráfico, se destruye para evitar duplicados
        if (grafico) grafico.destroy();
    
        // Crear un nuevo gráfico de tipo línea
        return new Chart(ctx, {
            type: "line", // Tipo de gráfico: línea
            data: {
                labels, // Etiquetas para el eje X
                datasets: [
                    { label: label1, data: data1, borderColor: "red", fill: false }, // Primer conjunto de datos
                    { label: label2, data: data2, borderColor: "blue", fill: false } // Segundo conjunto de datos
                ]
            },
            options: {
                responsive: true, // Hacer el gráfico responsivo
                plugins: { title: { display: true, text: titulo } } // Título del gráfico
            }
        });
    }
    
    function actualizarGraficoSimple(grafico, ctx, labels, data, titulo) {
        if (grafico) grafico.destroy();
    
        // Crear un nuevo gráfico de tipo barra
        return new Chart(ctx, {
            type: "bar", // Tipo de gráfico: barra
            data: {
                labels, // Etiquetas para el eje X
                datasets: [{ label: titulo, data, backgroundColor: "green" }] // Conjunto de datos
            },
            options: {
                responsive: true, // Hacer el gráfico responsivo
                plugins: { title: { display: true, text: titulo } } // Título del gráfico
            }
        });
    }
    

    

    configurarBotones();
});
