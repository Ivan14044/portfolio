import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type Language } from '../translations';

type TranslationContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.uk;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Определяем язык из localStorage или браузера
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'uk' || saved === 'ru' || saved === 'en')) {
      return saved;
    }
    // Определяем по языку браузера
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('uk')) return 'uk';
    if (browserLang.startsWith('ru')) return 'ru';
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = translations[language];

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}

