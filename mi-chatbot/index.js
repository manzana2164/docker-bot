const { OpenAI } = require("openai");
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
require('dotenv').config();
const puppeteer = require('puppeteer-core');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-setuid-sandbox'], 
    });

const client = new Client();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

client.on('message', async (message) => {
    console.log(message.body);

    if (message.body.startsWith("#")) {
        const result = await runCompletion(message.body.substring(1));
        message.reply(result);
    }
});

async function runCompletion(message) {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // o el modelo que estés utilizando
        messages: [{ role: "user", content: message }],
        max_tokens: 200,
    });
    return completion.choices[0].message.content;
}