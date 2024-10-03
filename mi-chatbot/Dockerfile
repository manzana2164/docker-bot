# Usar la imagen base de Node.js
FROM node:20

# Instalar Google Chrome
RUN apt-get update && apt-get install -y wget gnupg2 && \
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list && \
    apt-get update && apt-get install -y google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*
# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    libnss3 \
    libasound2 \
    libxss1 \
    libxrandr2 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify4 \
    fonts-liberation \
    xdg-utils \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Crear un usuario no privilegiado y su directorio home
RUN groupadd -r pptruser && useradd -r -g pptruser -m pptruser

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de configuración de npm primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalar Puppeteer y otras dependencias necesarias
RUN npm install puppeteer --no-save

# Copiar el resto del código de la aplicación al contenedor
COPY . .

# Cambiar al usuario no privilegiado
USER pptruser

# Exponer el puerto en el que la aplicación estará corriendo
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "index.js"]