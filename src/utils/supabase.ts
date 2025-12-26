import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Check your .env file.');
}

// Инициализация клиента Supabase
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Тип для проекта из базы данных
export interface DatabaseProject {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  services: string[];
  before_image: string;
  after_image: string;
  created_at?: string;
}

