# Документация по API социальных сетей

Этот документ описывает доступные API для получения данных из различных социальных сетей и как их интегрировать в проект.

## Обзор

Проект поддерживает интеграцию с несколькими социальными сетями:
- **VKontakte (VK)** - Российская социальная сеть
- **Telegram** - Мессенджер и платформа для каналов
- **Instagram** - Платформа для фото и видео
- **YouTube** - Видеохостинг

## VKontakte (VK) API

### Официальный API
- **Документация**: https://dev.vk.com/ru/api
- **Версия API**: 5.131 (текущая)
- **Базовый URL**: `https://api.vk.com/method`

### Получение токена доступа

1. Создайте приложение на https://vk.com/apps?act=manage
2. Получите Service Token или User Token
3. Добавьте в `.env`:
   ```
   VK_SERVICE_TOKEN=your_service_token_here
   ```

### Основные методы

#### Получение постов группы
```javascript
GET https://api.vk.com/method/wall.get
Params:
  - owner_id: ID группы (отрицательное число)
  - count: Количество постов (макс 100)
  - access_token: Ваш токен
  - v: Версия API (5.131)
```

#### Получение статистики поста
```javascript
GET https://api.vk.com/method/stats.getPostReach
Params:
  - owner_id: ID группы
  - post_id: ID поста
  - access_token: Ваш токен
  - v: Версия API
```

### Ограничения
- 3 запроса в секунду для обычных методов
- Требуется подтверждение приложения для некоторых методов
- Статистика доступна только для групп с более чем 1000 подписчиков

## Telegram API

### Bot API
- **Документация**: https://core.telegram.org/bots/api
- **Базовый URL**: `https://api.telegram.org/bot{token}`

### Получение токена

1. Создайте бота через @BotFather
2. Получите токен бота
3. Добавьте в `.env`:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```

### Ограничения
- Bot API не предоставляет статистику каналов напрямую
- Для получения статистики канала нужен доступ администратора
- Можно использовать Telegram Client API (MTProto) для более глубокой интеграции

### Альтернативные решения
- Использовать сторонние сервисы (Telegram Analytics)
- Парсить публичные данные каналов (если канал публичный)
- Использовать Telegram Ads API для рекламных метрик

## Instagram API

### Instagram Graph API
- **Документация**: https://developers.facebook.com/docs/instagram-api
- **Базовый URL**: `https://graph.instagram.com`

### Получение токена доступа

1. Создайте приложение на https://developers.facebook.com/apps/
2. Добавьте продукт "Instagram"
3. Получите Access Token через OAuth
4. Добавьте в `.env`:
   ```
   INSTAGRAM_ACCESS_TOKEN=your_access_token_here
   ```

### Основные методы

#### Получение медиа аккаунта
```javascript
GET https://graph.instagram.com/{user-id}/media
Params:
  - access_token: Ваш токен
  - fields: id,media_type,media_url,permalink,timestamp,caption,like_count,comments_count
```

#### Получение метрик
```javascript
GET https://graph.instagram.com/{media-id}/insights
Params:
  - metric: impressions,reach,engagement,likes,comments,saves,shares
  - access_token: Ваш токен
```

### Ограничения
- Требуется Business или Creator аккаунт
- Ограниченное количество запросов в час
- Некоторые метрики доступны только для Business аккаунтов

## YouTube Data API v3

### Официальный API
- **Документация**: https://developers.google.com/youtube/v3
- **Базовый URL**: `https://www.googleapis.com/youtube/v3`

### Получение API ключа

1. Перейдите в Google Cloud Console
2. Создайте проект и включите YouTube Data API v3
3. Создайте API ключ
4. Добавьте в `.env`:
   ```
   YOUTUBE_API_KEY=your_api_key_here
   ```

### Основные методы

#### Получение видео канала
```javascript
GET https://www.googleapis.com/youtube/v3/search
Params:
  - part: snippet
  - channelId: ID канала
  - type: video
  - maxResults: 50
  - key: Ваш API ключ
```

#### Получение статистики видео
```javascript
GET https://www.googleapis.com/youtube/v3/videos
Params:
  - part: statistics,snippet
  - id: ID видео
  - key: Ваш API ключ
```

### Ограничения
- 10,000 единиц квоты в день (бесплатно)
- Разные операции потребляют разное количество квоты
- Требуется OAuth для доступа к приватным данным

## Альтернативные решения

### 1. Парсинг публичных данных
Для некоторых сетей можно парсить публичные данные:
- **VK**: Публичные посты и статистика доступны без токена (ограниченно)
- **Telegram**: Публичные каналы можно парсить через веб-интерфейс
- **Instagram**: Публичные посты доступны через веб-скрапинг (может нарушать ToS)

### 2. Сторонние сервисы
- **Socialbakers** - Аналитика для всех основных сетей
- **Hootsuite Analytics** - Управление и аналитика
- **Buffer** - Планирование и аналитика
- **Sprout Social** - Комплексная аналитика

### 3. MWS Tables как источник данных
Проект использует **MWS Tables** как основной источник данных:
- Данные из всех сетей синхронизируются в MWS Tables
- Единый интерфейс для работы с данными
- Встроенные дашборды и аналитика

## Настройка в проекте

### Переменные окружения

Создайте файл `.env` в корне `content-registry-backend`:

```env
# MWS Tables
MWS_API_KEY=your_mws_api_key
MWS_APP_ID=your_mws_app_id
MWS_BASE_URL=https://api.mws.tables

# VK
VK_SERVICE_TOKEN=your_vk_token

# Telegram
TELEGRAM_BOT_TOKEN=your_telegram_token

# Instagram
INSTAGRAM_ACCESS_TOKEN=your_instagram_token

# YouTube
YOUTUBE_API_KEY=your_youtube_key

# AI Service
OPENROUTER_API_KEY=your_openrouter_key
```

### Использование в коде

```javascript
// В services/socialNetworksService.js
const networkData = await socialNetworksService.getNetworkData('vk');
```

## Рекомендации

1. **Начните с MWS Tables** - это основной источник данных
2. **Используйте официальные API** когда возможно
3. **Кэшируйте данные** для снижения количества запросов
4. **Обрабатывайте ошибки** и ограничения API
5. **Используйте мок-данные** для разработки без реальных токенов

## Проблемы и решения

### Проблема: Нет открытых API для некоторых сетей
**Решение**: Используйте MWS Tables как промежуточный слой. Данные можно вводить вручную или через интеграции.

### Проблема: Ограничения по количеству запросов
**Решение**: 
- Кэшируйте данные
- Используйте webhooks для обновлений
- Синхронизируйте данные периодически (cron jobs)

### Проблема: Требуется OAuth для доступа
**Решение**: 
- Настройте OAuth flow для пользователей
- Используйте Service Tokens где возможно
- Храните токены безопасно (не в коде)

## Дополнительные ресурсы

- [VK API Documentation](https://dev.vk.com/ru/api)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [MWS Tables Documentation](https://mws.tables/docs) - если доступна

