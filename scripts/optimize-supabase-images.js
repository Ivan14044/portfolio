import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Важно: нужен Service Role Key

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Ошибка: VITE_SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не найдены в .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const BUCKET_NAME = 'portfolio';
const TEMP_DIR = path.join(__dirname, 'temp_opt');

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

async function downloadImage(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function optimizeImage(buffer, name) {
  console.log(`  - Оптимизация ${name}...`);
  return await sharp(buffer)
    .resize(1920, null, { withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toBuffer();
}

async function uploadToSupabase(buffer, originalPath) {
  const fileName = path.basename(originalPath).split('?')[0];
  const webpName = fileName.substring(0, fileName.lastIndexOf('.')) + '.webp';
  const filePath = `optimized/${Date.now()}_${webpName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, buffer, {
      contentType: 'image/webp',
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return publicUrl;
}

async function processImageUrl(url) {
  if (!url || url.includes('/optimized/')) return url; // Пропускаем если уже оптимизировано
  
  try {
    const buffer = await downloadImage(url);
    const optimizedBuffer = await optimizeImage(buffer, path.basename(url));
    const newUrl = await uploadToSupabase(optimizedBuffer, url);
    console.log(`  ✅ Готово: ${newUrl}`);
    return newUrl;
  } catch (err) {
    console.error(`  ❌ Ошибка при обработке ${url}:`, err.message);
    return url;
  }
}

async function run() {
  console.log('🚀 Начинаю массовую оптимизацию изображений в Supabase...');

  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*');

    if (error) throw error;

    console.log(`📦 Найдено проектов: ${projects.length}`);

    for (const project of projects) {
      console.log(`\n📄 Обработка проекта: ${project.title_ru || project.title || project.id}`);
      
      const updates = {};

      // 1. Before Image
      if (project.before_image) {
        updates.before_image = await processImageUrl(project.before_image);
      }

      // 2. After Image
      if (project.after_image) {
        updates.after_image = await processImageUrl(project.after_image);
      }

      // 3. Additional Images
      if (project.additional_images && project.additional_images.length > 0) {
        const newAdditional = [];
        for (const imgUrl of project.additional_images) {
          newAdditional.push(await processImageUrl(imgUrl));
        }
        updates.additional_images = newAdditional;
      }

      // Обновляем запись в БД
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('projects')
          .update(updates)
          .eq('id', project.id);

        if (updateError) {
          console.error(`  ❌ Ошибка обновления записи БД: ${updateError.message}`);
        } else {
          console.log(`  ✨ Запись в БД успешно обновлена`);
        }
      }
    }

    console.log('\n🎉 Все изображения успешно оптимизированы!');
  } catch (err) {
    console.error('❌ Критическая ошибка:', err.message);
  } finally {
    if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
}

run();



