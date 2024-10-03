# docker-bot

Estructura del Proyecto
Asegúrate de que tu proyecto tenga la siguiente estructura:
text
/mi-chatbot
|-- docker-compose.yml
|-- Dockerfile
|-- .dockerignore
|-- package.json
|-- package-lock.json
|-- index.js

Contenido del Dockerfile
El Dockerfile se mantendrá similar al anterior. Aquí está el contenido:
text

# Usar la imagen base de Node.js

FROM node:20.16-alpine3.19

# Establecer el directorio de trabajo en el contenedor

WORKDIR /app

# Copiar los archivos de configuración de npm primero para aprovechar la caché de Docker

COPY package\*.json ./

# Instalar las dependencias necesarias

RUN npm install

# Copiar el resto del código de la aplicación al contenedor

COPY . .

# Exponer el puerto en el que la aplicación estará corriendo

EXPOSE 3000

# Deshabilitar la sandbox para Chromium (necesario para whatsapp-web.js)

ENV CHROME_BIN=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Comando para iniciar la aplicación

CMD ["node", "index.js"]

Contenido del docker-compose.yml
A continuación, se muestra un ejemplo del archivo docker-compose.yml que incluye volúmenes persistentes:
text
version: '3.8'

services:
chatbot:
build: .
ports: - "3000:3000"
volumes: - bot_data:/app/data # Volumen persistente para datos del bot
environment: - OPENAI_API_KEY=${OPENAI_API_KEY} # Cargar variable de entorno desde .env

volumes:
bot_data: # Definir un volumen llamado bot_data

Contenido del .dockerignore
El archivo .dockerignore debe ser similar al anterior:
text
node_modules
npm-debug.log
Dockerfile\*
.dockerignore

Instrucciones para Construir y Ejecutar con Docker Compose
Construir y ejecutar los servicios: Navega al directorio donde se encuentra tu docker-compose.yml y ejecuta:
bash
docker-compose up --build -d

Esto construirá la imagen y levantará el contenedor en segundo plano.
Configurar variables de entorno: Asegúrate de tener un archivo .env en tu directorio que contenga tu clave API de OpenAI:
text
OPENAI_API_KEY=tu_api_key

Verificar los servicios: Puedes verificar que tus servicios están corriendo con:
bash
docker-compose ps

Detener y eliminar los contenedores: Para detener los contenedores sin eliminar los volúmenes persistentes, utiliza:
bash
docker-compose down

Si deseas eliminar también los volúmenes, puedes usar:
bash
docker-compose down -v

Consideraciones Adicionales
Persistencia de Datos: El volumen bot_data asegura que cualquier dato almacenado en /app/data dentro del contenedor se mantenga incluso si el contenedor se detiene o se elimina.
Deshabilitar Sandbox: Si necesitas deshabilitar la sandbox para Chromium, asegúrate de agregar las opciones necesarias en tu código o en el comando de inicio.
