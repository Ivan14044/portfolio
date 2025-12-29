import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Check your .env file.');
}

// Инициализация клиента Supabase
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Тип для категории проекта
export interface Category {
  id: string;
  name_uk: string;
  name_ru: string;
  name_en: string;
  created_at?: string;
}

// Тип для проекта из базы данных
export interface DatabaseProject {
  id: string;
  category_id?: string; // Связь с таблицей категорий
  
  // Старые поля (для совместимости, пока не удаляем)
  title?: string;
  client: string;
  category?: string;
  description?: string;
  services?: string[];
  
  // Новые языковые поля
  title_uk: string;
  title_ru: string;
  title_en: string;
  
  category_uk: string;
  category_ru: string;
  category_en: string;
  
  description_uk: string;
  description_ru: string;
  description_en: string;
  
  services_uk: string[];
  services_ru: string[];
  services_en: string[];
  
  // Новые поля для детальной страницы
  additional_images?: string[];
  content_uk?: string;
  content_ru?: string;
  content_en?: string;
  
  before_image: string;
  after_image: string;
  created_at?: string;
}

export interface SiteSettings {
  id?: string;
  email: string;
  location_uk: string;
  location_ru: string;
  location_en: string;
  instagram_url: string;
  telegram_user: string;
  phone: string;
  updated_at?: string;
}
