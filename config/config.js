require('dotenv').config();

module.exports = {
  telegramToken: process.env.TELEGRAM_API_TOKEN,
  memosToken: process.env.MEMOS_API_TOKEN,
  memosUrl: process.env.MEMOS_API_URL,
};
