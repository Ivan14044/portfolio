export type ConsentRequirement = 'required' | 'notification' | 'none';

export interface CookieConsent {
  accepted: boolean;
  categories: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  timestamp: number;
  countryCode?: string;
  requirement?: ConsentRequirement;
}

const CONSENT_STORAGE_KEY = 'cookie_consent';

/**
 * Получает сохраненное согласие на cookies
 */
export function getCookieConsent(): CookieConsent | null {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to parse cookie consent from localStorage:', error);
  }
  return null;
}

/**
 * Сохраняет согласие на cookies
 */
export function saveCookieConsent(consent: CookieConsent): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch (error) {
    console.warn('Failed to save cookie consent to localStorage:', error);
  }
}

/**
 * Проверяет, было ли дано согласие на cookies
 */
export function hasCookieConsent(): boolean {
  const consent = getCookieConsent();
  return consent !== null && consent.accepted;
}

/**
 * Проверяет, требуется ли показывать баннер cookie consent
 */
export function shouldShowCookieBanner(
  requirement: ConsentRequirement
): boolean {
  // Не показываем, если согласие не требуется
  if (requirement === 'none') {
    return false;
  }

  // Проверяем, было ли уже дано согласие
  const consent = getCookieConsent();
  
  if (consent && consent.accepted) {
    return false;
  }

  // Показываем, если согласие требуется или требуется уведомление
  return requirement === 'required' || requirement === 'notification';
}

/**
 * Создает начальное согласие
 */
export function createDefaultConsent(
  requirement: ConsentRequirement,
  countryCode?: string
): CookieConsent {
  return {
    accepted: false,
    categories: {
      necessary: true, // Необходимые cookies всегда включены
      analytics: false,
      marketing: false,
    },
    timestamp: Date.now(),
    countryCode,
    requirement,
  };
}

/**
 * Устанавливает cookie (вспомогательная функция)
 */
export function setCookie(name: string, value: string, days?: number): void {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`;
}

/**
 * Получает cookie (вспомогательная функция)
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Удаляет cookie (вспомогательная функция)
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

