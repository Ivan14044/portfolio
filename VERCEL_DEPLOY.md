# Автоматический деплой на Vercel

Репозиторий успешно создан и код запушен: **https://github.com/Ivan14044/portfolio**

## Быстрый деплой через веб-интерфейс (рекомендуется)

1. Откройте https://vercel.com/new
2. Войдите через GitHub (нажмите "Continue with GitHub")
3. Нажмите "Import" для репозитория `Ivan14044/portfolio`
4. Vercel автоматически определит настройки:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **ВАЖНО: Перед деплоем добавьте Environment Variables:**
   - Нажмите "Environment Variables"
   - Добавьте:
     - `TELEGRAM_BOT_TOKEN` = `8548638828:AAFm1l0cnI2CLy4GDjedC2V37OqiAE_ItzU`
     - `TELEGRAM_CHAT_ID` = `6453578647`
   - Выберите все окружения (Production, Preview, Development)
   - Нажмите "Save"

6. Нажмите "Deploy"
7. Дождитесь завершения (обычно 1-3 минуты)
8. Ваш сайт будет доступен по адресу вида: `portfolio-xxxxx.vercel.app`

## Альтернатива: Через Vercel CLI

Vercel CLI уже установлен. Выполните:

```bash
vercel
```

Следуйте инструкциям:
- Войдите через браузер (откроется автоматически)
- Подтвердите настройки проекта
- Добавьте переменные окружения при запросе

## Проверка после деплоя

После успешного деплоя:

1. Откройте URL вашего проекта из Vercel Dashboard
2. Проверьте:
   - ✅ Все секции сайта отображаются
   - ✅ Навигация работает
   - ✅ Форма обратной связи открывается
3. Протестируйте форму:
   - Заполните тестовые данные
   - Отправьте сообщение
   - Проверьте Telegram - должно прийти сообщение

## Если форма не работает

1. Проверьте Environment Variables в Vercel Dashboard → Settings → Environment Variables
2. Убедитесь, что `TELEGRAM_CHAT_ID` = `6453578647`
3. Проверьте логи функции: Vercel Dashboard → Functions → telegram-send → Logs

## Готово!

Ваш портфолио будет доступен по бесплатному домену Vercel и готов к использованию!

