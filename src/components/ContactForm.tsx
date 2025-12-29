import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Instagram, MessageCircle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { sendContactForm } from '../utils/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormData {
  name: string;
  platform: 'instagram' | 'telegram' | '';
  contact: string;
  message: string;
}

interface FormErrors {
  name?: string;
  platform?: string;
  contact?: string;
  message?: string;
}

const ContactForm = React.memo(() => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    platform: '',
    contact: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Валидация имени
    if (!formData.name.trim()) {
      newErrors.name = t.contactForm.validation.nameRequired;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t.contactForm.validation.nameMin;
    }

    // Валидация платформы
    if (!formData.platform) {
      newErrors.platform = t.contactForm.validation.platformRequired;
    }

    // Валидация контакта
    if (!formData.contact.trim()) {
      newErrors.contact = t.contactForm.validation.contactRequired;
    } else {
      if (formData.platform === 'telegram') {
        // Telegram: должен начинаться с @ или быть числом
        const telegramPattern = /^(@[a-zA-Z0-9_]+|[0-9]+)$/;
        if (!telegramPattern.test(formData.contact.trim())) {
          newErrors.contact = t.contactForm.validation.telegramFormat;
        }
      } else if (formData.platform === 'instagram') {
        // Instagram: должен начинаться с @
        const instagramPattern = /^@[a-zA-Z0-9_.]+$/;
        if (!instagramPattern.test(formData.contact.trim())) {
          newErrors.contact = t.contactForm.validation.instagramFormat;
        }
      }
    }

    // Валидация сообщения (необязательное поле)
    // Если сообщение заполнено, проверяем минимальную длину
    if (formData.message.trim() && formData.message.trim().length < 10) {
      newErrors.message = t.contactForm.validation.messageMin;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await sendContactForm({
        name: formData.name.trim(),
        platform: formData.platform as 'instagram' | 'telegram',
        contact: formData.contact.trim(),
        message: formData.message.trim() || '', // Пустая строка, если не заполнено
      });

      setSubmitStatus('success');
      setFormData({
        name: '',
        platform: '',
        contact: '',
        message: '',
      });
      setErrors({});

      // Сброс статуса через 5 секунд
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      
      // Сброс статуса ошибки через 5 секунд
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  return (
    <motion.form
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="max-w-2xl w-full space-y-6"
    >
      <div>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-3 tracking-tight">
          {t.contactForm.title}
        </h3>
        <p className="text-white/60 text-base sm:text-lg leading-relaxed">
          {t.contactForm.description}
        </p>
      </div>

      {/* Поле имени */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-white/80">
          {t.contactForm.fields.name}
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder={t.contactForm.placeholders.name}
          className={cn(
            "w-full px-5 py-3.5 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/40",
            "focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800]/50",
            "transition-all duration-200",
            errors.name && "border-red-500/50 focus:border-red-500 focus:ring-red-500/50"
          )}
        />
        {errors.name && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 flex items-center gap-2 px-2"
          >
            <AlertCircle className="w-4 h-4" />
            {errors.name}
          </motion.p>
        )}
      </div>

      {/* Выбор платформы */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/80 mb-3">
          {t.contactForm.fields.platform}
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleChange('platform', 'instagram')}
            className={cn(
              "px-5 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-center gap-3",
              formData.platform === 'instagram'
                ? "bg-white/10 border-[#FFB800] text-white"
                : "bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
            )}
          >
            <Instagram className="w-5 h-5" />
            <span className="font-medium">Instagram</span>
          </button>
          <button
            type="button"
            onClick={() => handleChange('platform', 'telegram')}
            className={cn(
              "px-5 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-center gap-3",
              formData.platform === 'telegram'
                ? "bg-white/10 border-[#FFB800] text-white"
                : "bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
            )}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Telegram</span>
          </button>
        </div>
        {errors.platform && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 flex items-center gap-2 px-2"
          >
            <AlertCircle className="w-4 h-4" />
            {errors.platform}
          </motion.p>
        )}
      </div>

      {/* Поле контакта */}
      <div className="space-y-2">
        <label htmlFor="contact" className="block text-sm font-medium text-white/80">
          {t.contactForm.fields.contact}
          {formData.platform && (
            <span className="text-white/40 ml-2">
              ({formData.platform === 'instagram' ? '@username' : '@username или номер'})
            </span>
          )}
        </label>
        <input
          id="contact"
          type="text"
          value={formData.contact}
          onChange={(e) => handleChange('contact', e.target.value)}
          placeholder={t.contactForm.placeholders.contact}
          className={cn(
            "w-full px-5 py-3.5 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/40",
            "focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800]/50",
            "transition-all duration-200",
            errors.contact && "border-red-500/50 focus:border-red-500 focus:ring-red-500/50"
          )}
        />
        {errors.contact && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 flex items-center gap-2 px-2"
          >
            <AlertCircle className="w-4 h-4" />
            {errors.contact}
          </motion.p>
        )}
      </div>

      {/* Поле сообщения */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-white/80">
          {t.contactForm.fields.message}
          {t.contactForm.optional && (
            <span className="text-white/40 text-xs ml-2">({t.contactForm.optional})</span>
          )}
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder={t.contactForm.placeholders.message}
          rows={5}
          className={cn(
            "w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 resize-none",
            "focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800]/50",
            "transition-all duration-200",
            errors.message && "border-red-500/50 focus:border-red-500 focus:ring-red-500/50"
          )}
        />
        {errors.message && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 flex items-center gap-2 px-2"
          >
            <AlertCircle className="w-4 h-4" />
            {errors.message}
          </motion.p>
        )}
      </div>

      {/* Кнопка отправки */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        className={cn(
          "w-full px-6 py-3.5 rounded-full font-medium text-base transition-all duration-200",
          "flex items-center justify-center gap-3",
          submitStatus === 'success'
            ? "bg-green-500 text-white"
            : submitStatus === 'error'
            ? "bg-red-500 text-white"
            : "bg-white text-black hover:bg-white/90",
          isSubmitting && "opacity-70 cursor-not-allowed"
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t.contactForm.submitting}</span>
          </>
        ) : submitStatus === 'success' ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            <span>{t.contactForm.success}</span>
          </>
        ) : submitStatus === 'error' ? (
          <>
            <AlertCircle className="w-5 h-5" />
            <span>{t.contactForm.error}</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>{t.contactForm.submit}</span>
          </>
        )}
      </motion.button>
    </motion.form>
  );
});

export default ContactForm;

