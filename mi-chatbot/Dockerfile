# Usar la imagen base de Node.js
FROM node:20.16-alpine3.19

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de configuración de npm primero para aprovechar la caché de Docker
COPY package*.json ./

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