export interface ContactFormData {
  name: string;
  platform: 'instagram' | 'telegram';
  contact: string;
  message?: string; // Опциональное поле
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Отправляет данные формы обратной связи на backend
 */
export async function sendContactForm(data: ContactFormData): Promise<ApiResponse> {
  try {
    // Определяем URL API endpoint
    // В development используем локальный сервер через proxy
    // В production это будет реальный URL вашего backend (Vercel/Netlify)
    const apiUrl = import.meta.env.VITE_API_URL || '/api/telegram-send';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Unknown error';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.details || `HTTP error! status: ${response.status}`;
      } catch (e) {
        // Если не удалось распарсить JSON, используем статус
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result: ApiResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending contact form:', error);
    // Улучшаем сообщение об ошибке для пользователя
    if (error instanceof Error) {
      // Если это ошибка сети (нет подключения к серверу)
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Не удалось подключиться к серверу. Проверьте подключение к интернету или запустите локальный сервер.');
      }
      throw error;
    }
    throw new Error('Произошла неизвестная ошибка при отправке формы');
  }
}

