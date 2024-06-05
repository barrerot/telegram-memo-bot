const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

// Obtener los tokens y la URL de configuración
const telegramToken = process.env.TELEGRAM_API_TOKEN;
const memosToken = process.env.MEMOS_API_TOKEN;
const memosUrl = process.env.MEMOS_API_URL;

const bot = new TelegramBot(telegramToken, { polling: true });

// Función para enviar una nota a memos
const sendMemo = async (content, tags = []) => {
  const data = {
    content: content,
    tags: tags
  };

  console.log('Payload enviado:', JSON.stringify(data, null, 2));

  try {
    const response = await axios.post(memosUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${memosToken}`
      }
    });
    console.log('Nota creada exitosamente:');
    console.log(JSON.stringify(response.data, null, 2));
    return 'Nota creada exitosamente.';
  } catch (error) {
    if (error.response) {
      console.error('Error en la respuesta del servidor:', error.response.data);
      return `Error en la respuesta del servidor: ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request);
      return 'No se recibió respuesta del servidor.';
    } else {
      console.error('Error al configurar la solicitud:', error.message);
      return `Error al configurar la solicitud: ${error.message}`;
    }
  }
};

// Manejar el comando /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '¡Hola! Envíame un mensaje y lo guardaré como una nota en memos.');
});

// Manejar los mensajes de texto
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  // Excluir el comando /start para evitar bucle infinito
  if (messageText.startsWith('/start')) {
    return;
  }

  // Enviar la nota a memos
  const responseMessage = await sendMemo(messageText);
  bot.sendMessage(chatId, responseMessage);
});

// Manejar errores de polling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.code, error.message);
});
