// Простой локальный сервер для разработки
// Запуск: node server.js
// Или: npm run dev:server

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8548638828:AAFm1l0cnI2CLy4GDjedC2V37OqiAE_ItzU';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

async function getChatId() {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
    const data = await response.json();
    
    if (data.ok && data.result && data.result.length > 0) {
      const lastMessage = data.result[data.result.length - 1];
      return lastMessage.message?.chat?.id?.toString() || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting chat_id:', error);
    return null;
  }
}

async function sendTelegramMessage(chatId, text) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error('Telegram API error:', data);
    }
    return data.ok === true;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
}

function formatMessage(data) {
  const platformEmoji = data.platform === 'instagram' ? '📷' : '💬';
  const platformName = data.platform === 'instagram' ? 'Instagram' : 'Telegram';
  
  // Экранируем HTML символы для безопасности
  const escapeHtml = (text) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  
  const name = escapeHtml(data.name);
  const contact = escapeHtml(data.contact);
  const message = data.message && data.message.trim() ? escapeHtml(data.message.trim()) : null;
  
  let messageText = `🎯 <b>НОВАЯ ЗАЯВКА</b>

👤 <b>Имя:</b> ${name}
${platformEmoji} <b>Платформа:</b> ${platformName}
📞 <b>Контакт:</b> <code>${contact}</code>`;
  
  if (message) {
    messageText += `\n\n💬 <b>Сообщение:</b>\n${message}`;
  }
  
  messageText += `\n\n━━━━━━━━━━━━━━━━`;
  
  return messageText;
}

app.post('/api/telegram-send', async (req, res) => {
  try {
    const { name, platform, contact, message = '' } = req.body;

    if (!name || !platform || !contact) {
      return res.status(400).json({ error: 'Missing required fields: name, platform, contact' });
    }

    if (platform !== 'instagram' && platform !== 'telegram') {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    let chatId = TELEGRAM_CHAT_ID;
    
    if (!chatId) {
      chatId = await getChatId() || '';
      
      if (!chatId) {
        return res.status(500).json({ 
          error: 'Chat ID not found. Please set TELEGRAM_CHAT_ID environment variable or send a message to the bot first.' 
        });
      }
    }

    const messageText = formatMessage({ name, platform, contact, message });
    const success = await sendTelegramMessage(chatId, messageText);

    if (!success) {
      return res.status(500).json({ error: 'Failed to send message to Telegram' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/telegram-send`);
});

