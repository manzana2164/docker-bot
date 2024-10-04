const { OpenAI } = require("openai");
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
require('dotenv').config();
const puppeteer = require('puppeteer');

(async () => {
    // Lanzar Puppeteer con la ruta a Chromium
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser', // Ruta al binario de Chromium
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-crash-reporter'],
    });

    // Inicializar el cliente de WhatsApp
    const client = new Client({ puppeteer: { executablePath: '/usr/bin/chromium-browser' } });

    // Configurar la API de OpenAI
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Generar y mostrar el QR para la autenticación
    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
    });

    // Indicar que el cliente está listo
    client.on('ready', () => {
        console.log('Client is ready!');
    });

    // Inicializar el cliente de WhatsApp
    client.initialize();

    // Escuchar mensajes
    client.on('message', async (message) => {
        console.log(message.body);

        // Procesar mensajes que empiezan con "#"
        if (message.body.startsWith("#")) {
            const result = await runCompletion(message.body.substring(1));
            message.reply(result);
        }
    });

    // Función para ejecutar la completación de OpenAI
    async function runCompletion(message) {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // o el modelo que estés utilizando
            messages: [{ role: "user", content: message }],
            max_tokens: 200,
        });
        return completion.choices[0].message.content;
    }

    // Cerrar el navegador al finalizar
    process.on('exit', async () => {
        await browser.close();
    });
})();
