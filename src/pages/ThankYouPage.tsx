import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// Объявляем тип для window.fbq
declare global {
  interface Window {
    fbq: (action: string, event: string, params?: Record<string, unknown>) => void;
  }
}

export default function ThankYouPage() {

  useEffect(() => {
    // Отправляем событие конверсии в Meta Pixel при загрузке страницы
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead');
      // Также можно использовать 'CompleteRegistration' для регистраций
      // window.fbq('track', 'CompleteRegistration');
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Спасибо за заявку | Дарья Коваль</title>
        <meta name="description" content="Спасибо за вашу заявку! Я свяжусь с вами в ближайшее время." />
      </Helmet>
      
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full text-center space-y-8"
        >
          {/* Иконка успеха */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
          </motion.div>

          {/* Заголовок */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Спасибо за вашу заявку!
          </motion.h1>

          {/* Описание */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/70 text-lg md:text-xl leading-relaxed"
          >
            Я получила ваше сообщение и свяжусь с вами в ближайшее время.
            Обычно я отвечаю в течение 24 часов.
          </motion.p>

          {/* Кнопки */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <Link
              to="/"
              className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              <span>На главную</span>
            </Link>
            
            <Link
              to="/#contact"
              className="group flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full font-medium hover:bg-white/20 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Вернуться к форме</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
