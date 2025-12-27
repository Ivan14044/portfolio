import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  MapPin, 
  Home, 
  User, 
  Briefcase, 
  Zap, 
  Link as LinkIcon,
  Instagram,
  Linkedin,
  Send,
  Loader2,
} from 'lucide-react';
import { portfolioData } from '../data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from '../contexts/TranslationContext';
import { languageNames, LANGUAGES } from '../translations';
import { Globe, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import CaseStudyCard from '../components/CaseStudyCard';
import { supabase } from '../utils/supabase';
import type { DatabaseProject } from '../utils/supabase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function HomePage() {
  const { language, setLanguage, t } = useTranslation();
  const [activeSection, setActiveSection] = useState('home');
  const [activeImage, setActiveImage] = useState('image_1');
  const [blurLevel, setBlurLevel] = useState(0);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  
  // Состояние для динамических проектов из Supabase
  const [dbProjects, setDbProjects] = useState<DatabaseProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Загрузка проектов из Supabase
  useEffect(() => {
    async function fetchProjects() {
      console.log('🔄 Попытка загрузки проектов из Supabase...');
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('❌ Ошибка Supabase при загрузке:', error);
          throw error;
        }
        
        console.log('✅ Данные успешно получены. Количество проектов из БД:', data?.length || 0);
        // Принудительно обновляем состояние, чтобы React перерисовал компоненты
        setDbProjects([...(data || [])]);
      } catch (err) {
        console.error('⚠️ Критическая ошибка при загрузке данных:', err);
      } finally {
        setIsLoadingProjects(false);
      }
    }
    fetchProjects();
  }, [language]); // Перезагружаем при смене языка для надежности

  // Только динамические проекты из базы данных
  const displayProjects = (dbProjects || []).map(p => {
    // Логика выбора языка для каждого поля
    const getLocalizedField = (uk: any, ru: any, en: any, fallback?: any) => {
      if (language === 'uk') return uk || ru || en || fallback || '';
      if (language === 'ru') return ru || uk || en || fallback || '';
      return en || ru || uk || fallback || '';
    };

    return {
      title: getLocalizedField(p.title_uk, p.title_ru, p.title_en, p.title),
      client: p.client || '',
      category: getLocalizedField(p.category_uk, p.category_ru, p.category_en, p.category),
      description: getLocalizedField(p.description_uk, p.description_ru, p.description_en, p.description),
      services: getLocalizedField(p.services_uk, p.services_ru, p.services_en, p.services) || [],
      beforeImage: p.before_image,
      afterImage: p.after_image,
    };
  });

  console.log('📊 Итоговое количество проектов для отображения:', displayProjects.length);

  // Маппинг секций к изображениям
  const sectionImages: Record<string, string> = {
    home: 'image_1',
    summary: 'image_2',
    experience: 'image_3',
    portfolio: 'image_1',
    skills: 'image_2',
    contact: 'image_3',
    links: 'image_1'
  };

  // Маппинг секций к уровню блюра (в пикселях)
  const sectionBlurMap: Record<string, number> = {
    home: 0,
    summary: 8,
    experience: 12,
    portfolio: 6,
    skills: 8,
    contact: 6,
    links: 4
  };

  useEffect(() => {
    const sections = ['home', 'summary', 'experience', 'portfolio', 'skills', 'contact', 'links'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // Срабатывает, когда секция в центре экрана
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId !== activeSection) {
            setActiveSection(sectionId);
            setActiveImage(sectionImages[sectionId]);
            setBlurLevel(sectionBlurMap[sectionId]);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sectionImages, sectionBlurMap]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isLanguageMenuOpen && !target.closest('.language-switcher')) {
        setIsLanguageMenuOpen(false);
      }
    };

    if (isLanguageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isLanguageMenuOpen]);

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'summary', label: t.nav.summary, icon: User },
    { id: 'experience', label: t.nav.experience, icon: Briefcase },
    { id: 'portfolio', label: t.nav.portfolio || t.sections.portfolio || 'Портфолио', icon: Briefcase },
    { id: 'skills', label: t.nav.skills, icon: Zap },
    { id: 'contact', label: t.nav.contact || t.sections.contact, icon: Send },
    { id: 'links', label: t.nav.links, icon: LinkIcon },
  ];


  return (
    <div className="relative min-h-screen bg-[#080808] text-white selection:bg-[#FFB800]/40 font-sans overflow-x-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute top-[15%] right-[-5%] w-[1000px] h-[1000px] bg-[#FFB800]/5 rounded-full blur-[120px] will-change-transform" 
          style={{ transform: 'translateZ(0)' }} 
        />
        <div 
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-900/5 rounded-full blur-[100px] will-change-transform" 
          style={{ transform: 'translateZ(0)' }} 
        />
        
        {/* Hero Portrait Image with Dynamic Blur - Desktop */}
        <div className="hidden md:block absolute right-0 bottom-0 top-0 w-1/2 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                filter: blurLevel > 0 ? `blur(${blurLevel}px)` : 'none'
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="absolute inset-0 will-change-[filter,opacity]"
              style={{ transform: 'translateZ(0)' }}
            >
              <picture>
                <source srcSet={`/images/${activeImage}.webp`} type="image/webp" />
                <img 
                  src={`/images/${activeImage}.webp`} 
                  alt="Portrait" 
                  className="w-full h-full object-cover object-right-center"
                  loading="eager"
                  decoding="sync"
                  draggable={false}
                />
              </picture>
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-l from-[#080808] via-[#080808]/40 to-transparent z-10" />
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-12 sm:pt-16 md:pt-20">
        
        {/* Top Header */}
        <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-12 py-4 sm:py-6 md:py-8 flex items-center justify-between pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 pointer-events-auto"
          >
            <div className="w-2.5 h-2.5 bg-[#4ADE80] rounded-full shadow-[0_0_12px_#4ADE80]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t.status}</span>
          </motion.div>

          {/* Language Switcher - Apple Style */}
          <div className="relative pointer-events-auto language-switcher">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-2xl border border-white/20 px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/15"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <Globe className="w-4 h-4 text-white/80" />
              <span className="text-xs font-medium text-white">{languageNames[language]}</span>
              <ChevronDown className={cn(
                "w-3 h-3 text-white/60 transition-transform duration-300",
                isLanguageMenuOpen && "rotate-180"
              )} />
            </motion.button>

            <AnimatePresence>
              {isLanguageMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 min-w-[140px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsLanguageMenuOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 flex items-center justify-between",
                        language === lang
                          ? "bg-white/20 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <span>{languageNames[lang]}</span>
                      {language === lang && (
                        <motion.div
                          layoutId="languageIndicator"
                          className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"
                        />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Section: Home */}
        <section id="home" className="relative min-h-screen flex flex-col justify-center pt-20 sm:pt-24 pb-8 sm:pb-12 overflow-hidden">
          {/* Фоновое фото для мобильных */}
          <div className="md:hidden absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <picture>
                  <source srcSet={`/images/${activeImage}.webp`} type="image/webp" />
                  <img 
                    src={`/images/${activeImage}.webp`} 
                    alt="Portrait" 
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                    draggable={false}
                  />
                </picture>
                {/* Затемнение для лучшей читаемости текста */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#080808]/80 to-[#080808] z-10" />
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <h2 className="text-[#FFB800] font-black tracking-[0.3em] sm:tracking-[0.4em] mb-6 md:mb-8 text-xs sm:text-sm md:text-base uppercase">
              {t.title}
            </h2>
            
            <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] xl:text-[14rem] font-black mb-12 md:mb-20 tracking-tighter leading-[0.8] uppercase flex flex-col">
              <span className="block">{t.name.split(' ')[0]}</span>
              <span className="block text-white/95">{t.name.split(' ').slice(1).join(' ')}</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-24 max-w-4xl">
              <div className="space-y-6">
                <ContactItem icon={Mail} text={portfolioData.email} />
                <ContactItem icon={Instagram} text={portfolioData.linkedin} />
              </div>
              <div className="space-y-6">
                <ContactItem icon={Send} text="@daria_creative" />
                <ContactItem icon={MapPin} text={portfolioData.location} />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section: Summary */}
        <section id="summary" className="min-h-screen flex flex-col justify-center py-16 sm:py-24 md:py-32">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#FFB800] mb-12 md:mb-20 uppercase tracking-tight"
          >
            {t.sections.summary}
          </motion.h2>
          <div className="space-y-8 md:space-y-12 max-w-5xl text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 leading-snug font-medium tracking-tight">
            {t.summary.map((paragraph, i) => (
              <motion.p 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </section>

        {/* Section: Portfolio */}
        <section id="portfolio" className="min-h-screen py-16 sm:py-24 md:py-32">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#FFB800] mb-16 md:mb-32 uppercase tracking-tight"
          >
            {t.sections.portfolio || t.sections.caseStudies || 'Портфолио'}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {isLoadingProjects ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-white/20">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p>Загрузка проектов...</p>
              </div>
            ) : (
              displayProjects.map((caseStudy, cj) => (
                <CaseStudyCard 
                  key={cj} 
                  caseStudy={caseStudy}
                />
              ))
            )}
          </div>
        </section>

        {/* Section: Experience */}
        <section id="experience" className="min-h-screen py-16 sm:py-24 md:py-32">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#FFB800] mb-16 md:mb-32 uppercase tracking-tight"
          >
            {t.sections.experience}
          </motion.h2>
          
          <div className="space-y-24 md:space-y-48">
            {t.experience.map((exp, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
              >
                <div className="flex flex-col lg:flex-row gap-12 mb-16">
                  <div className="lg:w-1/3">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-[1px] bg-[#FFB800]" />
                      <span className="text-xl font-mono text-[#FFB800]">{exp.period}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-4 leading-none">{exp.role}</h3>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-white/40">{exp.company}</h4>
                  </div>
                  <div className="lg:w-2/3">
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 leading-relaxed mb-8 md:mb-12">
                      {exp.description}
                    </p>
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 pl-4 border-l border-white/5">
                  {exp.details.map((detail, di) => (
                    <motion.div 
                      key={di} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: di * 0.05 }}
                      className="flex items-start gap-3 md:gap-4 text-white/40 text-sm sm:text-base md:text-lg leading-snug group"
                    >
                      <span className="text-[#FFB800] font-black mt-[-2px] group-hover:scale-125 transition-transform">—</span>
                      <span className="group-hover:text-white/60 transition-colors">{detail}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section: Skills */}
        <section id="skills" className="min-h-screen py-16 sm:py-24 md:py-32">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#FFB800] mb-16 md:mb-32 uppercase tracking-tight"
          >
            {t.sections.skills}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 mb-32">
            <div className="space-y-6">
              {t.skills.slice(0, Math.ceil(t.skills.length / 2)).map((skill, si) => (
                <div key={si} className="flex items-center gap-4 group cursor-default">
                  <div className="w-2 h-2 bg-[#FFB800] rounded-full" />
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-[#FFB800] transition-colors duration-300">{skill}</span>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {t.skills.slice(Math.ceil(t.skills.length / 2)).map((skill, si) => (
                <div key={si} className="flex items-center gap-4 group cursor-default">
                  <div className="w-2 h-2 bg-[#FFB800] rounded-full" />
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-[#FFB800] transition-colors duration-300">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6 mb-32">
            {portfolioData.tools.map((tool, ti) => (
              <ToolIcon key={ti} name={tool.name} logo={tool.logo} />
            ))}
          </div>

          <div className="max-w-3xl">
            <h3 className="text-xs font-bold text-[#FFB800] uppercase tracking-wider mb-12">{t.sections.languages}</h3>
            <div className="space-y-8">
              {portfolioData.languages.map((lang, li) => (
                <div key={li} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-white">{lang.name}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${lang.level}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-[#FFB800]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Contact Form */}
        <section id="contact" className="min-h-screen flex flex-col justify-center py-16 sm:py-24 md:py-32">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[#FFB800] mb-12 md:mb-24 uppercase tracking-tighter"
          >
            {t.sections.contact}
          </motion.h2>
          
          <ContactForm />
        </section>

        {/* Section: Links */}
        <section id="links" className="min-h-screen flex flex-col justify-center py-16 sm:py-24 md:py-32">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[#FFB800] mb-12 md:mb-24 uppercase tracking-tighter"
          >
            {t.sections.links}
          </motion.h2>
          
          <div className="flex flex-wrap gap-8 mb-32">
            {portfolioData.socials.map((social, si) => (
              <SocialLink key={si} name={social.name} url={social.url} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-24 md:mb-48">
            <div className="group cursor-pointer">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-3 md:mb-4 block">{t.contact.emailMe}</span>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-[#FFB800] group-hover:text-black transition-all duration-500">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black group-hover:text-[#FFB800] transition-colors break-all">{portfolioData.email}</span>
              </div>
            </div>
            <div className="group cursor-pointer">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-3 md:mb-4 block">{t.contact.telegramMe}</span>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-[#FFB800] group-hover:text-black transition-all duration-500">
                  <Send className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black group-hover:text-[#FFB800] transition-colors break-all">@daria_creative</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/5 pt-20 pb-12 flex flex-col md:flex-row justify-between items-center gap-12 text-white/20 text-sm">
            <div className="space-y-2 text-center md:text-left">
              <p className="font-black uppercase tracking-widest">{t.footer.copyright}</p>
              <p className="text-white/40 font-bold">{t.footer.by}</p>
            </div>
            <div className="flex gap-16">
              <Link to="/privacy" className="hover:text-white transition-colors">{t.footer.privacy}</Link>
              <Link to="/terms" className="hover:text-white transition-colors">{t.footer.terms}</Link>
              <Link to="/cookies" className="hover:text-white transition-colors">{t.footer.cookies}</Link>
            </div>
          </footer>

      </main>

      {/* Floating Navbar - Apple Style */}
      <nav className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50">
        <motion.div 
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="bg-white/10 backdrop-blur-2xl border border-white/20 p-1.5 md:p-2 rounded-full flex items-center gap-1 md:gap-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {navItems.map((item) => (
            <NavItemWithTooltip
              key={item.id}
              item={item}
              activeSection={activeSection}
            />
          ))}
        </motion.div>
      </nav>
    </div>
  );
}

// Компонент навигационного элемента с tooltip
function NavItemWithTooltip({ 
  item, 
  activeSection 
}: { 
  item: { id: string; label: string; icon: any }; 
  activeSection: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const isActive = activeSection === item.id;

  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 500); // Долгое нажатие 500ms
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Скрываем tooltip автоматически через 2 секунды после показа
  useEffect(() => {
    if (showTooltip) {
      const hideTimer = setTimeout(() => setShowTooltip(false), 2000);
      return () => clearTimeout(hideTimer);
    }
  }, [showTooltip]);

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <motion.a
        href={`#${item.id}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "px-3 md:px-4 lg:px-5 py-2 md:py-2.5 rounded-full flex items-center gap-0 md:gap-2 lg:gap-2.5 transition-all duration-300 relative group",
          isActive 
            ? "bg-white/20 text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]" 
            : "text-white/60 hover:text-white/90 hover:bg-white/5"
        )}
      >
        <item.icon className={cn(
          "w-4 h-4 md:w-4 md:h-4 transition-all duration-300", 
          isActive 
            ? "scale-110 text-white" 
            : "group-hover:scale-110 text-inherit"
        )} />
        <span 
          className={cn(
            "text-[11px] font-medium tracking-wide transition-opacity duration-300 whitespace-nowrap hidden md:inline"
          )}
        >
          {item.label}
        </span>
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute inset-0 rounded-full bg-white/10 border border-white/20"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.a>

      {/* Tooltip - показывается на мобильных при долгом нажатии или на десктопе при наведении */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 5, scale: 0.95 }}
          className={cn(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg",
            "bg-black/90 backdrop-blur-sm border border-white/10 text-white text-xs font-medium whitespace-nowrap",
            "shadow-[0_4px_12px_rgba(0,0,0,0.5)] z-50",
            "md:hidden" // Показываем tooltip только на мобильных
          )}
        >
          {item.label}
          {/* Стрелка tooltip */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="w-2 h-2 bg-black/90 border-r border-b border-white/10 rotate-45"></div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function ContactItem({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-6 group cursor-pointer w-fit">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#FFB800] group-hover:text-black transition-all duration-500 group-hover:rotate-12">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-base sm:text-lg md:text-xl font-bold text-white/50 group-hover:text-white transition-colors tracking-tight break-all">{text}</span>
    </div>
  );
}

function ToolIcon({ name, logo }: { name: string, logo?: string }) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="flex flex-col items-center gap-3 group cursor-default">
      <div className="w-20 h-20 bg-[#1a1a1a] rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-[#FFB800]/30 transition-all duration-300 overflow-hidden p-4">
        {logo && !imageError ? (
          <img 
            src={logo} 
            alt={name} 
            className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
            style={{
              filter: logo.includes('simple-icons') || logo.includes('svg') 
                ? 'brightness(0) invert(1)' 
                : undefined
            }}
            onError={() => {
              console.error(`Failed to load icon for ${name}:`, logo);
              setImageError(true);
            }}
            loading="lazy"
          />
        ) : (
          <div className="text-3xl font-black text-white/10 group-hover:text-[#FFB800] transition-all duration-300">
            {name.substring(0, 1)}
          </div>
        )}
      </div>
      <span className="text-xs font-medium text-white/40 group-hover:text-white/60 transition-colors duration-300">{name}</span>
    </div>
  );
}

function SocialLink({ name, url }: { name: string, url: string }) {
  const icons: any = { LinkedIn: Linkedin, Instagram, X: Instagram, Behance: Instagram, Telegram: Send, Pinterest: Instagram };
  const Icon = icons[name] || Instagram;
  
  return (
    <motion.a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -8, scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      className="w-20 h-20 bg-[#111] rounded-3xl flex items-center justify-center border border-white/5 hover:border-[#FFB800]/60 hover:bg-[#FFB800] hover:text-black transition-all duration-500 group shadow-2xl"
    >
      <Icon className="w-8 h-8 transition-transform duration-500 group-hover:scale-110" />
    </motion.a>
  );
}

