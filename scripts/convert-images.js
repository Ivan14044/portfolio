import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  inputDirs: [
    path.join(__dirname, '..', 'public', 'images'),
    path.join(__dirname, '..', 'src', 'assets'),
    path.join(__dirname, '..', 'image')
  ],
  extensions: ['.jpg', '.jpeg', '.png', '.webp'],
  quality: 80,
  maxWidth: 1920
};

async function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    if (CONFIG.extensions.includes(ext) && !file.endsWith('.tmp')) {
      await convertToWebP(fullPath);
    }
  }
}

async function convertToWebP(filePath) {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const name = path.basename(filePath, ext);
  const outputPath = path.join(dir, `${name}.webp`);

  try {
    // Read to buffer to avoid file locking issues
    const inputBuffer = fs.readFileSync(filePath);
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    let pipeline = image;
    
    // Resize if too large
    if (metadata.width > CONFIG.maxWidth) {
      pipeline = pipeline.resize(CONFIG.maxWidth);
    }

    // Convert to webp with compression
    const outputBuffer = await pipeline
      .webp({ quality: CONFIG.quality, effort: 6 })
      .toBuffer();

    const originalSize = inputBuffer.length;
    const newSize = outputBuffer.length;

    if (ext.toLowerCase() !== '.webp' || newSize < originalSize) {
      // If it's a different extension, we will delete the old one after writing the new one
      // If it's the same extension (.webp), we just overwrite it
      fs.writeFileSync(outputPath, outputBuffer);
      
      if (ext.toLowerCase() !== '.webp') {
        fs.unlinkSync(filePath);
        console.log(`✅ Converted: ${path.basename(filePath)} -> ${name}.webp (${(newSize/1024).toFixed(1)} KB)`);
      } else {
        console.log(`✅ Optimized: ${path.basename(filePath)} (${(newSize/1024).toFixed(1)} KB)`);
      }
    } else {
      console.log(`ℹ️ Skipped (already optimal): ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

async function run() {
  console.log('🚀 Starting image optimization process...');
  for (const dir of CONFIG.inputDirs) {
    console.log(`\n📂 Scanning: ${dir}`);
    await processDirectory(dir);
  }
  console.log('\n✨ Optimization complete!');
}

run();
