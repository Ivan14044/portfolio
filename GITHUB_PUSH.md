# Инструкции по отправке кода в GitHub

Код готов к отправке в GitHub. Репозиторий создан: https://github.com/Ivan14044/portfolio

## Вариант 1: Через GitHub Desktop или другую программу
1. Откройте GitHub Desktop
2. Добавьте репозиторий: File → Add Local Repository
3. Выберите папку проекта
4. Нажмите "Publish repository"

## Вариант 2: Через командную строку (если нужна аутентификация)

Выполните следующие команды в терминале:

```bash
# Установите GitHub CLI (если еще не установлен)
# Windows: winget install --id GitHub.cli
# Или скачайте с https://cli.github.com

# Войдите в GitHub
gh auth login

# Отправьте код
git push -u origin main
```

## Вариант 3: Через веб-интерфейс GitHub

1. Откройте https://github.com/Ivan14044/portfolio
2. Скопируйте команды из раздела "…or push an existing repository from the command line"
3. Выполните их в терминале

## После успешной отправки

После того как код будет в GitHub, переходите к деплою на Vercel (см. DEPLOY_INSTRUCTIONS.md)




