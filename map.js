'use strict';

const apiKey = '634c44f6b412402884728a784d0b1191';

// Función para mostrar el mapa
export function inicializarMapa() {
    const map = L.map('mapa').setView([43.3837, -3.2188], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    const localizaciones = [
        { coordenadas: [43.3837, -3.2188], nombre: "Castro Urdiales" },
        { coordenadas: [43.380252, -3.213848], nombre: "Bahía de Castro Urdiales" },
        { coordenadas: [43.3846, -3.2157], nombre: "Santa Maria" },
        { coordenadas: [43.3808, -3.2192], nombre: "Sagrado Corazon" },
        { coordenadas: [43.3825, -3.2170], nombre: "Parque Amestoy" },
      
    ];
    const zonasAgricolas = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [-3.2317, 43.3756], // Esquina superior izquierda
                            [-3.2290, 43.3756], // Esquina superior derecha
                            [-3.2290, 43.3746], // Esquina inferior derecha
                            [-3.2317, 43.3746], // Esquina inferior izquierda
                            [-3.2317, 43.3756]  // Cierra el cuadrado
                        ]
                    ]
                },
                "properties": {
                    "nombre": "Zona Agrícola Castro"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [-3.2208, 43.3506], // Esquina superior izquierda
                            [-3.2181, 43.3506], // Esquina superior derecha
                            [-3.2181, 43.3496], // Esquina inferior derecha
                            [-3.2208, 43.3496], // Esquina inferior izquierda
                            [-3.2208, 43.3506]  // Cierra el cuadrado
                        ]
                    ]
                },
                "properties": {
                    "nombre": "Zona Agrícola Samano"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [-3.2130, 43.3500], // Esquina superior izquierda
                            [-3.2103, 43.3500], // Esquina superior derecha
                            [-3.2103, 43.3490], // Esquina inferior derecha
                            [-3.2130, 43.3490], // Esquina inferior izquierda
                            [-3.2130, 43.3500]  // Cierra el cuadrado
                        ]
                    ]
                },
                "properties": {
                    "nombre": "Zona Agrícola Santullan"
                }
            }
        ]
    };
    
    

    L.geoJSON(zonasAgricolas, {
        style: function (feature) {
            return {
                color: "#228B22",
                weight: 2,
                fillOpacity: 0.5
            };
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.nombre) {
                layer.bindPopup(feature.properties.nombre);
            }
        }
    }).addTo(map);

    async function obtenerDatosClima(lat, lon) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`);
            if (!response.ok) throw new Error('Error en la respuesta de la API');
            return await response.json();
        } catch (error) {
            console.error('Error al obtener datos del clima:', error);
        }
    }

    async function crearMarcadores() {
        for (const loc of localizaciones) {
            const data = await obtenerDatosClima(loc.coordenadas[0], loc.coordenadas[1]);
            if (data) {
                const contenidoPopup = `
                    <b>Nombre:</b> ${loc.nombre}<br>
                    <b>Temperatura:</b> ${data.main.temp.toFixed(1)}°C<br>
                    <b>Humedad:</b> ${data.main.humidity}%<br>
                    <b>Clima:</b> ${data.weather[0].description}
                `;
                L.marker(loc.coordenadas)
                    .addTo(map)
                    .bindPopup(contenidoPopup);
            }
        }
    }

    function obtenerUbicacionUsuario() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                map.setView([lat, lon], 13);

                const marcador = L.marker([lat, lon]).addTo(map);
                marcador.bindPopup('Tu ubicación actual').openPopup();
            }, (error) => {
                console.error('Error al obtener la ubicación del usuario:', error);
            });
        } else {
            console.error('La geolocalización no es soportada por este navegador.');
        }
    }

    crearMarcadores();
    obtenerUbicacionUsuario();

    // Ajustar el mapa al tamaño de la ventana
    window.addEventListener('resize', () => {
        map.invalidateSize();
    });
}

// Cuando el DOM esté completamente cargado, inicializa el mapa
document.addEventListener('DOMContentLoaded', () => {
    inicializarMapa();
});
