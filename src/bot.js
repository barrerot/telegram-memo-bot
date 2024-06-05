const TelegramBot = require('node-telegram-bot-api');
const { telegramToken } = require('../config/config');
const { sendMemo } = require('./memoService');

const bot = new TelegramBot(telegramToken, { polling: true });

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
