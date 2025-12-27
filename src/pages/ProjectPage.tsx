import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Briefcase, 
  User, 
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Maximize2
} from 'lucide-react';
import { supabase, type DatabaseProject } from '../utils/supabase';
import { useTranslation } from '../contexts/TranslationContext';
import CaseStudyCard from '../components/CaseStudyCard';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useTranslation();
  const [project, setProject] = useState<DatabaseProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        navigate('/'); // Возвращаемся на главную при ошибке
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FFB800]" size={48} />
      </div>
    );
  }

  if (!project) return null;

  const getLocalizedField = (uk: any, ru: any, en: any, fallback?: any) => {
    if (language === 'uk') return uk || ru || en || fallback || '';
    if (language === 'ru') return ru || uk || en || fallback || '';
    return en || ru || uk || fallback || '';
  };

  const title = getLocalizedField(project.title_uk, project.title_ru, project.title_en, project.title);
  const category = getLocalizedField(project.category_uk, project.category_ru, project.category_en, project.category);
  const description = getLocalizedField(project.description_uk, project.description_ru, project.description_en, project.description);
  const services = getLocalizedField(project.services_uk, project.services_ru, project.services_en, project.services) || [];
  const content = getLocalizedField(project.content_uk, project.content_ru, project.content_en);

  const allImages = [
    project.before_image,
    project.after_image,
    ...(project.additional_images || [])
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#FFB800]/40 font-sans">
      {/* Header / Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-12 py-6 flex items-center justify-between pointer-events-none">
        <Link 
          to="/" 
          className="bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 pointer-events-auto flex items-center gap-2 hover:bg-[#FFB800] hover:text-black transition-all group shadow-xl"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">{t.nav.home || 'Назад'}</span>
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-5 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-[1px] bg-[#FFB800]" />
                <span className="text-sm font-bold text-[#FFB800] uppercase tracking-[0.3em]">{category}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] mb-8 tracking-tighter">
                {title}
              </h1>

              <div className="space-y-6 text-lg text-white/60 leading-relaxed font-medium">
                <p>{description}</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-12 border-t border-white/5"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#FFB800]">
                  <User size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Клиент</span>
                </div>
                <p className="text-xl font-bold">{project.client}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#FFB800]">
                  <Layers size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Категория</span>
                </div>
                <p className="text-xl font-bold">{category}</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-[#FFB800]">
                <Briefcase size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Услуги</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {services.map((service: string, i: number) => (
                  <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-bold">
                    {service}
                  </span>
                ))}
              </div>
            </motion.div>

            {content && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="prose prose-invert max-w-none pt-12 border-t border-white/5"
              >
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">История проекта</h3>
                <div className="text-white/70 text-lg leading-relaxed whitespace-pre-line">
                  {content}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Visuals */}
          <div className="lg:col-span-7 space-y-12">
            {/* Main Comparison Slider */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="rounded-3xl overflow-hidden shadow-2xl border border-white/5"
            >
              <CaseStudyCard 
                caseStudy={{
                  id: project.id,
                  title: title,
                  client: project.client,
                  category: category,
                  description: description,
                  services: services,
                  beforeImage: project.before_image,
                  afterImage: project.after_image
                }} 
              />
            </motion.div>

            {/* Additional Gallery */}
            {(project.additional_images && project.additional_images.length > 0) && (
              <div className="space-y-8">
                <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.3em]">Галерея</h3>
                <div className="grid grid-cols-2 gap-6">
                  {project.additional_images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 cursor-pointer group"
                      onClick={() => setSelectedImage(img)}
                    >
                      <img 
                        src={img} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt={`Detail ${idx + 1}`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-[#FFB800]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 size={32} className="text-white drop-shadow-lg" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              className="max-w-full max-h-full rounded-2xl object-contain shadow-2xl"
              alt="Full size view"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="max-w-7xl mx-auto px-4 py-20 border-t border-white/5 text-center">
        <Link 
          to="/" 
          className="inline-flex items-center gap-4 text-white/40 hover:text-[#FFB800] transition-all group"
        >
          <ArrowLeft className="group-hover:-translate-x-2 transition-transform" />
          <span className="text-xl font-black uppercase tracking-widest">Вернуться к портфолио</span>
        </Link>
      </footer>
    </div>
  );
}

