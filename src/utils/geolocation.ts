import type { ConsentRequirement } from './cookieUtils';

// Список стран, требующих cookie consent
// ISO 3166-1 alpha-2 коды стран

// Страны ЕС (27 стран)
const EU_COUNTRIES = [
  'AT', // Австрия
  'BE', // Бельгия
  'BG', // Болгария
  'HR', // Хорватия
  'CY', // Кипр
  'CZ', // Чехия
  'DK', // Дания
  'EE', // Эстония
  'FI', // Финляндия
  'FR', // Франция
  'DE', // Германия
  'GR', // Греция
  'HU', // Венгрия
  'IE', // Ирландия
  'IT', // Италия
  'LV', // Латвия
  'LT', // Литва
  'LU', // Люксембург
  'MT', // Мальта
  'NL', // Нидерланды
  'PL', // Польша
  'PT', // Португалия
  'RO', // Румыния
  'SK', // Словакия
  'SI', // Словения
  'ES', // Испания
  'SE', // Швеция
];

// Страны, требующие согласия (GDPR и аналогичные законы)
const CONSENT_REQUIRED_COUNTRIES = [
  ...EU_COUNTRIES,
  'GB', // Великобритания (UK GDPR)
  'BR', // Бразилия (LGPD)
  'KR', // Южная Корея
  'CH', // Швейцария
  'NO', // Норвегия
  'IS', // Исландия
  'LI', // Лихтенштейн
];

// Страны, требующие уведомления (CCPA/CPRA)
const NOTIFICATION_REQUIRED_COUNTRIES = [
  'US', // США (CCPA для Калифорнии)
];

// ConsentRequirement экспортируется из cookieUtils для единообразия

export interface GeolocationResult {
  countryCode: string;
  countryName?: string;
  requirement: ConsentRequirement;
}

/**
 * Проверяет, требуется ли cookie consent для данной страны
 */
export function requiresConsent(countryCode: string): ConsentRequirement {
  const upperCode = countryCode.toUpperCase();
  
  if (CONSENT_REQUIRED_COUNTRIES.includes(upperCode)) {
    return 'required';
  }
  
  if (NOTIFICATION_REQUIRED_COUNTRIES.includes(upperCode)) {
    return 'notification';
  }
  
  return 'none';
}

/**
 * Определяет страну пользователя через API
 */
export async function detectCountry(): Promise<GeolocationResult | null> {
  try {
    // Используем бесплатный API ipapi.co
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Geolocation API failed');
    }

    const data = await response.json();
    const countryCode = data.country_code || data.country;
    
    if (countryCode) {
      return {
        countryCode: countryCode.toUpperCase(),
        countryName: data.country_name,
        requirement: requiresConsent(countryCode),
      };
    }
  } catch (error) {
    console.warn('Failed to detect country via API:', error);
  }

  return null;
}

/**
 * Определяет страну по языку браузера (fallback)
 */
export function detectCountryByLanguage(): GeolocationResult | null {
  const language = navigator.language || (navigator.languages && navigator.languages[0]);
  
  if (!language) {
    return null;
  }

  // Маппинг языков к странам (основные)
  const languageToCountry: Record<string, string> = {
    'uk': 'UA',
    'ru': 'RU',
    'en-GB': 'GB',
    'en-US': 'US',
    'de': 'DE',
    'fr': 'FR',
    'es': 'ES',
    'it': 'IT',
    'pt': 'PT',
    'nl': 'NL',
    'pl': 'PL',
    'ko': 'KR',
    'pt-BR': 'BR',
  };

  // Проверяем полный код языка (например, en-GB)
  if (language.includes('-')) {
    const langCode = language.split('-')[0];
    
    if (languageToCountry[language]) {
      const code = languageToCountry[language];
      return {
        countryCode: code,
        requirement: requiresConsent(code),
      };
    }
    
    // Проверяем только код языка
    if (languageToCountry[langCode]) {
      const code = languageToCountry[langCode];
      return {
        countryCode: code,
        requirement: requiresConsent(code),
      };
    }
  }

  // Проверяем только код языка
  const langCode = language.split('-')[0];
  if (languageToCountry[langCode]) {
    const code = languageToCountry[langCode];
    return {
      countryCode: code,
      requirement: requiresConsent(code),
    };
  }

  return null;
}

/**
 * Получает страну пользователя с кэшированием
 */
export async function getUserCountry(): Promise<GeolocationResult | null> {
  const CACHE_KEY = 'user_country_detection';
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 часа

  // Проверяем кэш
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const data = JSON.parse(cached);
      const now = Date.now();
      
      if (data.timestamp && (now - data.timestamp) < CACHE_DURATION) {
        return {
          countryCode: data.countryCode,
          countryName: data.countryName,
          requirement: data.requirement,
        };
      }
    } catch (e) {
      // Игнорируем ошибки парсинга
    }
  }

  // Пытаемся определить через API
  const result = await detectCountry();
  
  if (result) {
    // Сохраняем в кэш
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      ...result,
      timestamp: Date.now(),
    }));
    return result;
  }

  // Fallback: определение по языку
  const fallbackResult = detectCountryByLanguage();
  
  if (fallbackResult) {
    // Сохраняем в кэш (но с меньшим приоритетом)
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      ...fallbackResult,
      timestamp: Date.now(),
    }));
    return fallbackResult;
  }

  return null;
}

