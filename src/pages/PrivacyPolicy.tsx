import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-24">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">{t.nav.home}</span>
          </Link>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black text-[#FFB800] mb-4 uppercase tracking-tight"
        >
          {t.privacyPolicy.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/40 text-sm mb-16"
        >
          {t.privacyPolicy.lastUpdated}
        </motion.p>

        {/* Sections */}
        <div className="space-y-12">
          {t.privacyPolicy.sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="border-l-2 border-[#FFB800]/30 pl-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#FFB800] mb-4">
                {section.title}
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 pt-12 border-t border-white/5 flex flex-wrap gap-8 text-sm"
        >
          <Link to="/terms" className="text-white/40 hover:text-white transition-colors">
            {t.footer.terms}
          </Link>
          <Link to="/cookies" className="text-white/40 hover:text-white transition-colors">
            {t.footer.cookies}
          </Link>
          <Link to="/" className="text-white/40 hover:text-white transition-colors">
            {t.nav.home}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

