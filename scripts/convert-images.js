import sharp from 'sharp';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URL изображений с Unsplash (похожие на описание - девушка с камерой, дымный фон)
const images = [
  {
    url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=1200&q=80',
    name: 'hero-portrait-1'
  },
  {
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80',
    name: 'hero-portrait-2'
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
    name: 'hero-portrait-3'
  }
];

async function downloadAndConvert(url, name) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '..', 'public', 'images', `${name}.jpg`);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', async () => {
        file.close();
        console.log(`Downloaded ${name}.jpg`);
        
        // Конвертируем в WebP
        const webpPath = path.join(__dirname, '..', 'public', 'images', `${name}.webp`);
        await sharp(filePath)
          .webp({ quality: 85 })
          .toFile(webpPath);
        
        console.log(`Converted ${name}.webp`);
        
        // Удаляем оригинальный JPG
        fs.unlinkSync(filePath);
        resolve();
      });
    }).on('error', (err) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading and converting images...');
  
  for (const image of images) {
    try {
      await downloadAndConvert(image.url, image.name);
    } catch (error) {
      console.error(`Error processing ${image.name}:`, error);
    }
  }
  
  console.log('Done!');
}

main();
