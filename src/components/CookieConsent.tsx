import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Settings, Check } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { getUserCountry } from '../utils/geolocation';
import {
  shouldShowCookieBanner,
  saveCookieConsent,
  getCookieConsent,
  type CookieConsent,
  type ConsentRequirement,
} from '../utils/cookieUtils';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CookieConsent() {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [requirement, setRequirement] = useState<ConsentRequirement>('none');
  const [categories, setCategories] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const checkConsent = async () => {
      const userCountry = await getUserCountry();
      
      if (userCountry) {
        const req = userCountry.requirement;
        setRequirement(req);
        
        // Проверяем, нужно ли показывать баннер (учитывая сохраненное согласие)
        if (shouldShowCookieBanner(req)) {
          // Загружаем сохраненные категории, если есть
          const savedConsent = getCookieConsent();
          if (savedConsent) {
            setCategories(savedConsent.categories);
          }
          setShowBanner(true);
        }
      }
    };

    checkConsent();
  }, []);

  const handleAcceptAll = () => {
    const consent: CookieConsent = {
      accepted: true,
      categories: {
        necessary: true,
        analytics: true,
        marketing: true,
      },
      timestamp: Date.now(),
      requirement,
    };
    saveCookieConsent(consent);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const consent: CookieConsent = {
      accepted: true,
      categories: {
        necessary: true,
        analytics: false,
        marketing: false,
      },
      timestamp: Date.now(),
      requirement,
    };
    saveCookieConsent(consent);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSaveSettings = () => {
    const consent: CookieConsent = {
      accepted: true,
      categories,
      timestamp: Date.now(),
      requirement,
    };
    saveCookieConsent(consent);
    setShowBanner(false);
    setShowSettings(false);
  };

  const toggleCategory = (category: 'analytics' | 'marketing') => {
    setCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!showBanner || requirement === 'none') {
    return null;
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div
            className="mx-auto max-w-4xl rounded-2xl p-6 md:p-8 backdrop-blur-2xl border border-white/10 shadow-xl"
            style={{
              background: 'rgba(8, 8, 8, 0.85)',
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
              boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            }}
          >
            {!showSettings ? (
              <>
                <div className="flex items-start justify-between gap-6 mb-8">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3 tracking-tight">
                      {t.cookieConsent.title}
                    </h3>
                    <p className="text-white/60 text-base md:text-lg leading-relaxed">
                      {t.cookieConsent.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBanner(false)}
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/15 flex items-center justify-center transition-all duration-200"
                  >
                    <X className="w-4 h-4 text-white/50" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-2.5 rounded-full bg-white text-black font-medium hover:bg-white/90 active:scale-[0.98] transition-all duration-200 text-sm md:text-base shadow-sm"
                  >
                    {t.cookieConsent.acceptAll}
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-6 py-2.5 rounded-full bg-white/10 text-white font-medium hover:bg-white/15 active:scale-[0.98] transition-all duration-200 border border-white/10 text-sm md:text-base"
                  >
                    {t.cookieConsent.rejectAll}
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-6 py-2.5 rounded-full bg-transparent text-white font-medium hover:bg-white/5 active:scale-[0.98] transition-all duration-200 border border-white/10 text-sm md:text-base flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    {t.cookieConsent.customize}
                  </button>
                  <Link
                    to="/cookies"
                    className="px-6 py-2.5 rounded-full text-white/50 hover:text-white/70 font-medium transition-colors text-sm md:text-base text-center"
                  >
                    {t.cookieConsent.learnMore}
                  </Link>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                    {t.cookieConsent.customize}
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/15 flex items-center justify-center transition-all duration-200"
                  >
                    <X className="w-4 h-4 text-white/50" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Necessary Cookies - всегда включены */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-4">
                        <h4 className="font-medium text-white mb-1.5">
                          {t.cookieConsent.categories.necessary}
                        </h4>
                        <p className="text-sm text-white/50 leading-relaxed">
                          {t.cookieConsent.categories.necessaryDesc}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-11 h-6 rounded-full bg-white/20 flex items-center justify-end px-1">
                          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                            <Check className="w-3 h-3 text-black" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-4">
                        <h4 className="font-medium text-white mb-1.5">
                          {t.cookieConsent.categories.analytics}
                        </h4>
                        <p className="text-sm text-white/50 leading-relaxed">
                          {t.cookieConsent.categories.analyticsDesc}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleCategory('analytics')}
                        className={cn(
                          "flex-shrink-0 w-11 h-6 rounded-full transition-all duration-300 flex items-center",
                          categories.analytics
                            ? "bg-white justify-end"
                            : "bg-white/20 justify-start"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 m-0.5 rounded-full transition-all duration-300",
                          categories.analytics
                            ? "bg-black"
                            : "bg-white"
                        )} />
                      </button>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-4">
                        <h4 className="font-medium text-white mb-1.5">
                          {t.cookieConsent.categories.marketing}
                        </h4>
                        <p className="text-sm text-white/50 leading-relaxed">
                          {t.cookieConsent.categories.marketingDesc}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleCategory('marketing')}
                        className={cn(
                          "flex-shrink-0 w-11 h-6 rounded-full transition-all duration-300 flex items-center",
                          categories.marketing
                            ? "bg-white justify-end"
                            : "bg-white/20 justify-start"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 m-0.5 rounded-full transition-all duration-300",
                          categories.marketing
                            ? "bg-black"
                            : "bg-white"
                        )} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <button
                    onClick={handleSaveSettings}
                    className="flex-1 px-6 py-2.5 rounded-full bg-white text-black font-medium hover:bg-white/90 active:scale-[0.98] transition-all duration-200 shadow-sm"
                  >
                    {t.cookieConsent.acceptAll}
                  </button>
                  <Link
                    to="/cookies"
                    className="px-6 py-2.5 rounded-full text-white/50 hover:text-white/70 font-medium transition-colors text-center"
                  >
                    {t.cookieConsent.learnMore}
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

