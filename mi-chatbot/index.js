const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { OpenAIApi, Configuration } = require("openai");
require('dotenv').config();

const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

client.on('message', async (message) => {
    console.log(message.body);

    if (message.body.startsWith("#")) {
        const result = await runCompletion(message.body.substring(1));
        message.reply(result);
    }
});

async function runCompletion(message) {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        max_tokens: 200,
    });
    return completion.data.choices[0].text;
}