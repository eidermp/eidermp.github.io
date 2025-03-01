# AgriWeb

**AgriWeb** es una plataforma web diseñada para agricultores que les permite monitorear las condiciones meteorológicas en tiempo real y predecir posibles cosechas mediante el uso de técnicas de Machine Learning. La aplicación utiliza APIs para obtener información sobre el clima y un modelo preentrenado para predicción basado en **MobileNet**.

## Características

- **Monitoreo de clima en tiempo real:**  
  Utiliza las APIs de OpenWeatherMap y OpenMeteo para obtener datos actualizados sobre el clima (temperatura, humedad, viento, etc.).
  
- **Predicciones agrícolas:**  
  Basado en datos previos, el modelo entrenado con MobileNet predice posibles resultados en las cosechas.

- **Interfaz intuitiva:**  
  Una interfaz sencilla para los agricultores, que pueden ver fácilmente la información meteorológica y las recomendaciones para sus cultivos.

## Tecnologías Utilizadas

- **Frontend:**
  - HTML
  - CSS
  - JavaScript
  - Chart.js (para la visualización de datos)

- **Backend:**
  - Firebase (para la autenticación de usuarios y almacenamiento)
  
- **Machine Learning:**
  - MobileNet (para predicciones relacionadas con las cosechas)
  - TensorFlow.js (si se utiliza para entrenar modelos directamente en el navegador)

- **APIs:**
  - OpenWeatherMap (para obtener datos meteorológicos)
  - OpenMeteo (para obtener datos meteorológicos)

## Instalación

### Requisitos Previos

1. Asegúrate de tener instalado un servidor web o usar un entorno local como `Live Server` de VS Code.
2. Tener una cuenta en **Firebase** para usar la autenticación.

### Pasos para ejecutar el proyecto

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/eidermp/agriweb.git
