// Serverless функция для отправки сообщений в Telegram бот
// Для Vercel: поместите в папку /api
// Для Netlify: поместите в папку /netlify/functions

import type { VercelRequest, VercelResponse } from '@vercel/node';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8548638828:AAFm1l0cnI2CLy4GDjedC2V37OqiAE_ItzU';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

interface ContactFormData {
  name: string;
  platform: 'instagram' | 'telegram';
  contact: string;
  message?: string; // Опциональное поле
}

/**
 * Получает chat_id владельца бота через getUpdates
 * Вызывается один раз для получения chat_id
 */
async function getChatId(): Promise<string | null> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
    const data = await response.json();
    
    if (data.ok && data.result && data.result.length > 0) {
      // Берем chat_id из последнего сообщения
      const lastMessage = data.result[data.result.length - 1];
      return lastMessage.message?.chat?.id?.toString() || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting chat_id:', error);
    return null;
  }
}

/**
 * Отправляет сообщение в Telegram
 */
async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
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
    return data.ok === true;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
}

/**
 * Форматирует данные формы в сообщение для Telegram
 */
function formatMessage(data: ContactFormData): string {
  const platformEmoji = data.platform === 'instagram' ? '📷' : '💬';
  const platformName = data.platform === 'instagram' ? 'Instagram' : 'Telegram';
  
  // Экранируем HTML символы для безопасности
  const escapeHtml = (text: string) => {
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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Проверяем наличие токена
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Валидация данных
    const { name, platform, contact, message = '' }: ContactFormData = req.body;

    if (!name || !platform || !contact) {
      return res.status(400).json({ error: 'Missing required fields: name, platform, contact' });
    }

    if (platform !== 'instagram' && platform !== 'telegram') {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    // Получаем chat_id (если не задан в переменных окружения)
    let chatId = TELEGRAM_CHAT_ID;
    
    if (!chatId) {
      // Пытаемся получить chat_id автоматически
      chatId = await getChatId() || '';
      
      if (!chatId) {
        return res.status(500).json({ 
          error: 'Chat ID not found. Please set TELEGRAM_CHAT_ID environment variable or send a message to the bot first.' 
        });
      }
    }

    // Форматируем и отправляем сообщение
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
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

