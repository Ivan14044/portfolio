import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../contexts/TranslationContext';

export interface CaseStudy {
  title: string;
  client: string;
  category: string;
  description: string;
  services: string[];
  beforeImage?: string;
  afterImage?: string;
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  beforeImage?: string;
  afterImage?: string;
}

export default function CaseStudyCard({ caseStudy, beforeImage, afterImage }: CaseStudyCardProps) {
  const { t } = useTranslation();
  const [sliderPosition, setSliderPosition] = useState(50); // Начальная позиция 50%
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Используем переданные изображения или из caseStudy, или заглушки
  const beforeImg = beforeImage || caseStudy.beforeImage || `/images/image_1.webp`;
  const afterImg = afterImage || caseStudy.afterImage || `/images/image_2.webp`;

  // Обработка позиции слайдера (оптимизированная версия)
  const updatePosition = (clientX: number, skipAnimation = false) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    
    if (skipAnimation || isDragging) {
      // Во время перетаскивания обновляем напрямую для максимальной отзывчивости
      setSliderPosition(clampedPercentage);
    } else {
      setSliderPosition(clampedPercentage);
    }
  };

  // Обработчики мыши
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    updatePosition(e.clientX);
  };


  // Обработчики touch для мобильных
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updatePosition(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isDragging) {
      updatePosition(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Клик по карточке для установки позиции
  const handleContainerClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      updatePosition(e.clientX);
    }
  };

  // Глобальные обработчики для перетаскивания вне карточки
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const percentage = ((e.clientX - rect.left) / rect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, percentage)));
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const percentage = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      const clampedPercentage = Math.max(0, Math.min(100, percentage));
      // Обновляем напрямую без requestAnimationFrame для максимальной отзывчивости
      setSliderPosition(clampedPercentage);
    };

    const handleGlobalTouchEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    document.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative aspect-[4/5] bg-[#141414] rounded-2xl overflow-hidden border border-white/5 hover:border-[#FFB800]/30 transition-all duration-500 shadow-xl"
    >
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="absolute inset-0 w-full h-full cursor-col-resize"
      >
        {/* After Image (фон, всегда внизу) */}
        <div className="absolute inset-0">
          {afterImg ? (
            <img 
              src={afterImg} 
              alt={`${caseStudy.title} - ${t.sections.after}`} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-black" />
          )}
        </div>

        {/* Before Image (верхний слой, обрезается по позиции слайдера) */}
        <div 
          className="absolute inset-0 overflow-hidden z-10"
          style={{ 
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            transition: isDragging ? 'none' : 'clip-path 0.1s ease-out'
          }}
        >
          {beforeImg ? (
            <img 
              src={beforeImg} 
              alt={`${caseStudy.title} - ${t.sections.before}`} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-black" />
          )}
        </div>

        {/* Разделительная линия */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-lg z-30"
          style={{ left: `${sliderPosition}%`, transition: isDragging ? 'none' : 'left 0.1s ease-out' }}
        >
          {/* Индикатор на линии (круг с стрелками) */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm border-2 border-[#FFB800] shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Подписи "До" и "После" */}
        <div className="absolute top-6 left-6 z-20">
          <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {t.sections.before}
            </span>
          </div>
        </div>
        <div className="absolute top-6 right-6 z-20">
          <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {t.sections.after}
            </span>
          </div>
        </div>

        {/* Overlay gradient для лучшей читаемости текста */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Content (информация о кейсе) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 z-20 pointer-events-none">
        <div className="mb-3">
          <h6 className="text-lg sm:text-xl font-bold mb-1 group-hover:text-[#FFB800] transition-colors tracking-tight">
            {caseStudy.title}
          </h6>
          <p className="text-white/60 text-xs sm:text-sm font-medium mb-2">{caseStudy.client}</p>
          <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider mb-3">{caseStudy.category}</p>
        </div>
        
        <p className="text-white/70 text-xs sm:text-sm leading-snug font-medium mb-4">{caseStudy.description}</p>
        
        {/* Services tags */}
        <div className="flex flex-wrap gap-2">
          {caseStudy.services.map((service, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-white/5 text-white/60 text-xs font-medium border border-white/10"
            >
              {service}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
