import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, type MotionValue } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Mail, 
  MapPin, 
  Home, 
  User, 
  Briefcase, 
  Zap, 
  Instagram,
  Linkedin,
  Send,
  Loader2,
  Globe, 
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { portfolioData } from '../data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from '../contexts/TranslationContext';
import { languageNames, LANGUAGES } from '../translations';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import CaseStudyCard from '../components/CaseStudyCard';
import type { CaseStudy } from '../components/CaseStudyCard';
import { supabase } from '../utils/supabase';
import type { DatabaseProject, SiteSettings, Category } from '../utils/supabase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Кастомный хук для плавного и оптимизированного blur эффекта
const useThrottledBlur = (scrollYProgress: MotionValue<number>) => {
  const [blurValue, setBlurValue] = useState(0);
  
  useEffect(() => {
    let rafId: number;
    const unsubscribe = scrollYProgress.on('change', (latest: number) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // Уменьшаем интенсивность блюра для производительности (макс 6px вместо 8px)
        const blur = Math.min(6, latest * 20); 
        setBlurValue(blur);
      });
    });
    
    return () => {
      unsubscribe();
      cancelAnimationFrame(rafId);
    };
  }, [scrollYProgress]);
  
  return blurValue;
};

const navItems = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'summary', label: 'Обо мне', icon: User },
  { id: 'portfolio', label: 'Портфолио', icon: Briefcase },
  { id: 'experience', label: 'Опыт', icon: Zap },
  { id: 'contact', label: 'Контакты', icon: Mail },
];

// Определение производительности устройства
const usePerformanceMode = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(() => {
    // Проверяем сохраненное значение в localStorage
    const saved = localStorage.getItem('performance_mode');
    if (saved) {
      return saved === 'low';
    }
    
    // Проверяем hardwareConcurrency (количество ядер)
    const cores = navigator.hardwareConcurrency || 4;
    // Проверяем deviceMemory (если доступно)
    const memory = (navigator as any).deviceMemory || 4;
    
    // Определяем слабое устройство: меньше 4 ядер или меньше 4GB памяти
    return cores < 4 || memory < 4;
  });
  
  useEffect(() => {
    // Проверяем connection (если доступно) и обновляем состояние
    const connection = (navigator as any).connection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    
    if (isSlowConnection) {
      setIsLowPerformance(true);
      localStorage.setItem('performance_mode', 'low');
    } else {
      // Сохраняем текущее значение
      localStorage.setItem('performance_mode', isLowPerformance ? 'low' : 'high');
    }
  }, [isLowPerformance]);
  
  return isLowPerformance;
};

export default function HomePage() {
  const { language, setLanguage, t } = useTranslation();
  const [activeSection, setActiveSection] = useState('home');
  const [activeImage, setActiveImage] = useState('image_1');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [projects, setProjects] = useState<DatabaseProject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  // Определяем производительность устройства
  const isLowPerformance = usePerformanceMode();

  const { scrollYProgress } = useScroll();
  
  // Оптимизированный блюр через кастомный хук с троттлингом
  // Отключаем blur на слабых устройствах для лучшей производительности
  const blurValue = useThrottledBlur(scrollYProgress);
  const blurStyle = (!isLowPerformance && blurValue > 0.1) ? `blur(${blurValue}px)` : 'none';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, categoriesRes, settingsRes] = await Promise.all([
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('project_categories').select('*').order('created_at', { ascending: true }),
          supabase.from('site_settings').select('*').single()
        ]);
        
        if (projectsRes.data) setProjects(projectsRes.data);
        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (settingsRes.data) setSettings(settingsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchData();
  }, []);

  const getLocalizedField = useCallback((uk: string, ru: string, en: string) => {
    if (language === 'uk') return uk;
    if (language === 'ru') return ru;
    return en;
  }, [language]);

  // Группировка проектов по категориям
  const categorizedProjects = useMemo(() => {
    const groups: Record<string, CaseStudy[]> = {};
    
    projects.forEach(p => {
      const catId = p.category_id || 'uncategorized';
      if (!groups[catId]) groups[catId] = [];
      
      groups[catId].push({
        id: p.id,
        title: getLocalizedField(p.title_uk, p.title_ru, p.title_en),
        client: p.client,
        category: getLocalizedField(p.category_uk, p.category_ru, p.category_en),
        description: getLocalizedField(p.description_uk, p.description_ru, p.description_en),
        services: language === 'uk' ? p.services_uk : language === 'ru' ? p.services_ru : p.services_en,
        beforeImage: p.before_image,
        afterImage: p.after_image
      });
    });
    
    return groups;
  }, [projects, language]);

  const toggleCategory = useCallback((catId: string) => {
    setExpandedCategories(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  }, []);

  // Оптимизированный IntersectionObserver для отслеживания активной секции
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersectingEntry = entries.find(entry => entry.isIntersecting);
        if (intersectingEntry) {
          const sectionId = intersectingEntry.target.id;
          setActiveSection(sectionId);
          
          // Смена фонового изображения
          if (sectionId === 'home') {
            setActiveImage('image_1');
          } else if (sectionId === 'summary') {
            setActiveImage('image_2');
          } else if (['portfolio', 'experience', 'skills', 'contact', 'links'].includes(sectionId)) {
            setActiveImage('image_3');
          }
        }
      },
      { 
        threshold: 0.2,
        rootMargin: '-10% 0px -10% 0px' // Оптимизируем область срабатывания
      }
    );

    const sections = ['home', 'summary', 'portfolio', 'experience', 'skills', 'contact', 'links'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const seoTitle = `Дарья Коваль — Photo Retoucher & Content Creator`;
  const seoDescription = `Профессиональная ретушь фотографий, цветокоррекция и создание контента. Портфолио Дарьи Коваль.`;

  return (
    <div className="relative min-h-screen bg-[#080808] text-white selection:bg-[#FFB800]/40 font-sans overflow-x-hidden">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        
        {/* Preload LCP Image */}
        <link rel="preload" as="image" href="/image/image_1.webp" />
        
        {/* OpenGraph */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
      </Helmet>
      
      {/* Background Effects - Упрощены для производительности */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Убраны тяжелые blur эффекты для лучшей производительности на слабых ПК */}
        <div 
          className="absolute top-[15%] right-[-5%] w-[1000px] h-[1000px] bg-[#FFB800]/5 rounded-full opacity-30" 
          style={{ 
            transform: 'translateZ(0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }} 
        />
        <div 
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-900/5 rounded-full opacity-30" 
          style={{ 
            transform: 'translateZ(0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }} 
        />
        
        {/* Hero Portrait Image with Dynamic Blur - Desktop */}
        <div className="hidden md:block absolute right-0 bottom-0 top-0 w-1/2 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1
              }}
              style={{ 
                filter: blurStyle
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: "linear" }}
              className="absolute inset-0"
            >
              <picture>
                <source srcSet={`/image/${activeImage}.webp`} type="image/webp" />
                <img 
                  src={`/image/${activeImage}.webp`} 
                  alt="Portrait" 
                  className="w-full h-full object-cover object-right-center"
                  loading="eager"
                  decoding="async"
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
            className="flex items-center gap-3 bg-black/40 backdrop-blur-[4px] px-4 py-2 rounded-full border border-white/5 pointer-events-auto"
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
              aria-label="Сменить язык"
              aria-expanded={isLanguageMenuOpen}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-[4px] border border-white/20 px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/15"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(4px) saturate(180%)',
                WebkitBackdropFilter: 'blur(4px) saturate(180%)',
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
                  className="absolute top-full right-0 mt-2 min-w-[140px] bg-white/10 backdrop-blur-[4px] border border-white/20 rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(4px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(4px) saturate(180%)',
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
                style={{ 
                  filter: blurStyle
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <picture>
                  <source srcSet={`/image/${activeImage}.webp`} type="image/webp" />
                  <img 
                    src={`/image/${activeImage}.webp`} 
                    alt="Portrait" 
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
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
            style={{
              transform: 'translateZ(0)',
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden'
            }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] xl:text-[14rem] font-black mb-12 md:mb-20 tracking-tighter leading-[0.8] uppercase flex flex-col">
              <span className="block">{t.name.split(' ')[0]}</span>
              <span className="block text-white/95">{t.name.split(' ').slice(1).join(' ')}</span>
            </h1>

            <p className="text-[#FFB800] font-black tracking-[0.3em] sm:tracking-[0.4em] mb-6 md:mb-8 text-xs sm:text-sm md:text-base uppercase">
              {t.title}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-24 max-w-4xl">
              <div className="space-y-6">
                <ContactItem icon={Mail} text={settings?.email || portfolioData.email} />
                <ContactItem 
                  icon={Instagram} 
                  text={settings?.instagram_url?.replace('https://', '').replace('www.', '') || 'instagram.com/daria_creator'} 
                  link={settings?.instagram_url}
                />
              </div>
              <div className="space-y-6">
                <ContactItem 
                  icon={Send} 
                  text={settings?.telegram_user ? `@${settings.telegram_user}` : "@daria_creative"} 
                  link={settings?.telegram_user ? `https://t.me/${settings.telegram_user}` : undefined}
                />
                <ContactItem 
                  icon={MapPin} 
                  text={settings ? getLocalizedField(settings.location_uk, settings.location_ru, settings.location_en) : portfolioData.location} 
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section: Summary */}
        <section 
          id="summary" 
          className="min-h-screen flex flex-col justify-center py-16 sm:py-24 md:py-32"
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#FFB800] mb-12 md:mb-20 uppercase tracking-tight"
          >
            {t.sections.summary}
          </motion.h2>
          <div className="space-y-8 md:space-y-12 max-w-5xl text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 leading-snug font-medium tracking-tight">
            {t.summary.map((paragraph, i) => (
              <p 
                key={i}
                className={cn(
                  "opacity-0 animate-fade-in-up",
                  isLowPerformance && "opacity-100"
                )}
                style={isLowPerformance ? {} : { animationDelay: `${i * 0.1}s` }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Section: Portfolio */}
        <section 
          id="portfolio" 
          className="min-h-screen py-16 sm:py-24 md:py-32"
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#FFB800] mb-16 md:mb-32 uppercase tracking-tight"
          >
            {t.sections.portfolio || t.sections.caseStudies || 'Портфолио'}
          </motion.h2>
          
          {isLoadingProjects ? (
            <div className="py-20 flex flex-col items-center justify-center text-white/20">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p>Загрузка проектов...</p>
            </div>
          ) : (
            <div className="space-y-32">
              {/* Рендерим каждую категорию */}
              {categories.map((category) => {
                const projectsInCategory = categorizedProjects[category.id] || [];
                if (projectsInCategory.length === 0) return null;
                
                const isExpanded = expandedCategories.includes(category.id);
                const displayedProjects = isExpanded ? projectsInCategory : projectsInCategory.slice(0, 3);
                
                return (
                  <div key={category.id} className="space-y-12">
                    <div className="flex items-baseline gap-6">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white/90">
                        {getLocalizedField(category.name_uk, category.name_ru, category.name_en)}
                      </h3>
                      <div className="h-[1px] flex-1 bg-white/5" />
                      <span className="text-xs font-mono text-[#FFB800]/50">{projectsInCategory.length} PROJECTS</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {displayedProjects.map((caseStudy) => (
                        <div key={caseStudy.id}>
                          <CaseStudyCard caseStudy={caseStudy} />
                        </div>
                      ))}
                    </div>
                    
                    {projectsInCategory.length > 3 && (
                      <div className="flex justify-center pt-8">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="group flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl hover:bg-[#FFB800] hover:text-black transition-all duration-500 font-bold uppercase text-xs tracking-widest"
                        >
                          {isExpanded ? 'Свернуть' : `Показать еще (${projectsInCategory.length - 3})`}
                          <ChevronRight className={cn("w-4 h-4 transition-transform duration-500", isExpanded && "rotate-90")} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Проекты без категории (старые или системные) */}
              {categorizedProjects['uncategorized'] && categorizedProjects['uncategorized'].length > 0 && (
                <div className="space-y-12">
                  <div className="flex items-baseline gap-6">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white/90">
                      {language === 'ru' ? 'Другие работы' : language === 'uk' ? 'Інші роботи' : 'Other Works'}
                    </h3>
                    <div className="h-[1px] flex-1 bg-white/5" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {categorizedProjects['uncategorized'].map((caseStudy) => (
                      <div key={caseStudy.id}>
                        <CaseStudyCard caseStudy={caseStudy} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Section: Experience */}
        <section 
          id="experience" 
          className="min-h-screen py-16 sm:py-24 md:py-32"
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#FFB800] mb-16 md:mb-32 uppercase tracking-tight"
          >
            {t.sections.experience}
          </motion.h2>
          
          <div className="space-y-24 md:space-y-48">
            {t.experience.map((exp, i) => (
              <div 
                key={i} 
                className={cn(
                  "relative",
                  !isLowPerformance && "opacity-0 animate-fade-in-up"
                )}
                style={isLowPerformance ? {} : { animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex flex-col lg:flex-row gap-12 mb-16">
                  <div className="lg:w-1/3">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-[1px] bg-[#FFB800]" />
                      <span className="text-xl font-mono text-[#FFB800]">{exp.period}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-4 leading-none">{exp.role}</h3>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-white/60">{exp.company}</h4>
                  </div>
                  <div className="lg:w-2/3">
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed mb-8 md:mb-12">
                      {exp.description}
                    </p>
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 pl-4 border-l border-white/5">
                  {exp.details.map((detail, di) => (
                    <div 
                      key={di} 
                      className="flex items-start gap-3 md:gap-4 text-white/60 text-sm sm:text-base md:text-lg leading-snug group"
                    >
                      <span className="text-[#FFB800] font-black mt-[-2px] group-hover:scale-125 transition-transform">—</span>
                      <span className="group-hover:text-white/90 transition-colors">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Skills */}
        <section 
          id="skills" 
          className="min-h-screen py-16 sm:py-24 md:py-32"
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#FFB800] mb-16 md:mb-32 uppercase tracking-tight"
          >
            {t.sections.skills}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 mb-32">
            <div className="space-y-6">
              {t.skills.slice(0, Math.ceil(t.skills.length / 2)).map((skill, si) => (
                <div key={si} className="flex items-center gap-4 group cursor-default">
                  <div className="w-2 h-2 bg-[#FFB800] rounded-full" />
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-white/90 group-hover:text-[#FFB800] transition-colors duration-300">{skill}</span>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {t.skills.slice(Math.ceil(t.skills.length / 2)).map((skill, si) => (
                <div key={si} className="flex items-center gap-4 group cursor-default">
                  <div className="w-2 h-2 bg-[#FFB800] rounded-full" />
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-white/90 group-hover:text-[#FFB800] transition-colors duration-300">{skill}</span>
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
                    {isLowPerformance ? (
                      <div 
                        className="h-full bg-[#FFB800]"
                        style={{ width: `${lang.level}%` }}
                      />
                    ) : (
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${lang.level}%` }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-[#FFB800]"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Contact Form */}
        <section 
          id="contact" 
          className="min-h-screen flex flex-col justify-center py-16 sm:py-24 md:py-32"
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[#FFB800] mb-12 md:mb-24 uppercase tracking-tighter"
          >
            {t.sections.contact}
          </motion.h2>
          
          <ContactForm />
        </section>

        {/* Section: Links */}
        <section 
          id="links" 
          className="min-h-screen flex flex-col justify-center py-16 sm:py-24 md:py-32"
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[#FFB800] mb-12 md:mb-24 uppercase tracking-tighter"
          >
            {t.sections.links}
          </motion.h2>
          
          <div className="flex flex-wrap gap-8 mb-32">
            {settings?.instagram_url && <SocialLink name="Instagram" url={settings.instagram_url} />}
            {settings?.telegram_user && <SocialLink name="Telegram" url={`https://t.me/${settings.telegram_user}`} />}
            {!settings && portfolioData.socials.map((social, si) => (
              <SocialLink key={si} name={social.name} url={social.url} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-24 md:mb-48">
            <a 
              href={`mailto:${settings?.email || portfolioData.email}`}
              aria-label={`Отправить email на ${settings?.email || portfolioData.email}`}
              className="group cursor-pointer block"
            >
              <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-3 md:mb-4 block">{t.contact.emailMe}</span>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-[#FFB800] group-hover:text-black transition-all duration-500">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black group-hover:text-[#FFB800] transition-colors break-all text-white">{settings?.email || portfolioData.email}</span>
              </div>
            </a>
            <a 
              href={settings?.telegram_user ? `https://t.me/${settings.telegram_user}` : "https://t.me/daria_creative"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Связаться в Telegram: @${settings?.telegram_user || 'daria_creative'}`}
              className="group cursor-pointer block"
            >
              <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-3 md:mb-4 block">{t.contact.telegramMe}</span>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-[#FFB800] group-hover:text-black transition-all duration-500">
                  <Send className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black group-hover:text-[#FFB800] transition-colors break-all text-white">
                  {settings?.telegram_user ? `@${settings.telegram_user}` : "@daria_creative"}
                </span>
              </div>
            </a>
          </div>
        </section>

        <footer className="border-t border-white/5 pt-20 pb-12 flex flex-col md:flex-row justify-between items-center gap-12 text-white/60 text-sm">
            <div className="space-y-2 text-center md:text-left">
              <p className="font-black uppercase tracking-widest">{t.footer.copyright}</p>
              <p className="text-white/70 font-bold">{t.footer.by}</p>
            </div>
            <div className="flex gap-16">
              <Link to="/privacy" className="hover:text-[#FFB800] transition-colors">{t.footer.privacy}</Link>
              <Link to="/terms" className="hover:text-[#FFB800] transition-colors">{t.footer.terms}</Link>
              <Link to="/cookies" className="hover:text-[#FFB800] transition-colors">{t.footer.cookies}</Link>
            </div>
          </footer>

      </main>

      {/* Floating Navbar - Apple Style */}
      <nav className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50">
        <motion.div 
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="bg-white/10 backdrop-blur-[4px] border border-white/20 p-1.5 md:p-2 rounded-full flex items-center gap-1 md:gap-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(4px) saturate(180%)',
            WebkitBackdropFilter: 'blur(4px) saturate(180%)',
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
const NavItemWithTooltip = React.memo(({ 
  item, 
  activeSection 
}: { 
  item: { id: string; label: string; icon: any }; 
  activeSection: string;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const isActive = activeSection === item.id;

  const handleTouchStart = useCallback(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 500); // Долгое нажатие 500ms
    setLongPressTimer(timer);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

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
        aria-label={item.label}
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
});

const ContactItem = React.memo(({ icon: Icon, text, link }: { icon: any, text: string, link?: string }) => {
  const content = (
    <div className="flex items-center gap-6 group cursor-pointer w-fit">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#FFB800] group-hover:text-black transition-all duration-500 group-hover:rotate-12">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-base sm:text-lg md:text-xl font-bold text-white/70 group-hover:text-white transition-colors tracking-tight break-all">{text}</span>
    </div>
  );

  if (link) {
    const isInstagram = link.includes('instagram.com');
    const isTelegram = link.includes('t.me');
    let label = `Связаться через ${text}`;
    if (isInstagram) label = `Открыть Instagram: ${text}`;
    if (isTelegram) label = `Связаться в Telegram: ${text}`;

    return <a href={link} target="_blank" rel="noopener noreferrer" aria-label={label}>{content}</a>;
  }

  return content;
});

const ToolIcon = React.memo(({ name, logo }: { name: string, logo?: string }) => {
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
            decoding="async"
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
});

const SocialLink = React.memo(({ name, url }: { name: string, url: string }) => {
  const icons: any = { LinkedIn: Linkedin, Instagram, X: Instagram, Behance: Instagram, Telegram: Send, Pinterest: Instagram };
  const Icon = icons[name] || Instagram;
  
  let label = `Перейти в ${name}`;
  if (name === 'Instagram') {
    const username = url.split('/').pop()?.replace('@', '');
    label = `Открыть Instagram: @${username}`;
  }
  if (name === 'Telegram') {
    const username = url.split('/').pop()?.replace('@', '');
    label = `Связаться в Telegram: @${username}`;
  }

  return (
    <motion.a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ y: -8, scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      className="w-20 h-20 bg-[#111] rounded-3xl flex items-center justify-center border border-white/5 hover:border-[#FFB800]/60 hover:bg-[#FFB800] hover:text-black transition-all duration-500 group shadow-2xl"
    >
      <Icon className="w-8 h-8 transition-transform duration-500 group-hover:scale-110" />
    </motion.a>
  );
});
