import imageCompression from 'browser-image-compression';

interface OptimizeOptions {
  maxWidthOrHeight?: number;
  maxSizeMB?: number;
  fileType?: string;
}

/**
 * Оптимизирует изображение перед загрузкой на сервер.
 * Сжимает, меняет размер и конвертирует в WebP.
 */
export async function optimizeImage(file: File, options: OptimizeOptions = {}): Promise<File> {
  const {
    maxWidthOrHeight = 1920,
    maxSizeMB = 0.8,
    fileType = 'image/webp'
  } = options;

  const compressionOptions = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: fileType as any,
    initialQuality: 0.8
  };

  try {
    console.log(`🚀 Optimizing image: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    const compressedFile = await imageCompression(file, compressionOptions);
    
    // Создаем новый файл с расширением .webp
    const fileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const webpFile = new File([compressedFile], `${fileName}.webp`, {
      type: 'image/webp',
      lastModified: Date.now(),
    });

    console.log(`✅ Optimized: ${webpFile.name} (${(webpFile.size / 1024).toFixed(1)} KB)`);
    return webpFile;
  } catch (error) {
    console.error('❌ Error optimizing image:', error);
    return file; // Возвращаем оригинал в случае ошибки
  }
}

/**
 * Оптимизирует массив изображений.
 */
export async function optimizeImages(files: File[], options: OptimizeOptions = {}): Promise<File[]> {
  return Promise.all(files.map(file => optimizeImage(file, options)));
}


