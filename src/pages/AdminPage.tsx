import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import type { DatabaseProject, SiteSettings } from '../utils/supabase';
import { LogOut, Plus, Trash2, Image as ImageIcon, Check, AlertCircle, Loader2, ArrowLeft, Languages, Pencil, Database, Settings, Mail, MapPin, Instagram, Send, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { portfolioData } from '../data';

type Lang = 'uk' | 'ru' | 'en';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<DatabaseProject[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [activeLang, setActiveLang] = useState<Lang>('uk');
  const [adminTab, setAdminTab] = useState<'projects' | 'settings'>('projects');
  
  // Состояние для настроек сайта
  const [settings, setSettings] = useState<SiteSettings>({
    email: '',
    location_uk: '',
    location_ru: '',
    location_en: '',
    instagram_url: '',
    telegram_user: '',
    phone: '',
  });
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  
  // Состояния для редактирования
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Состояние для новой формы проекта
  const [newProject, setNewProject] = useState({
    title_uk: '', title_ru: '', title_en: '',
    client: '',
    category_uk: '', category_ru: '', category_en: '',
    description_uk: '', description_ru: '', description_en: '',
    services_uk: '', services_ru: '', services_en: '',
    content_uk: '', content_ru: '', content_en: '',
  });
  
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchProjects();
      fetchSettings();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'DariaPortfolio_Secure_2025';
    if (password === adminPass) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      setError('');
      fetchProjects();
      fetchSettings();
    } else {
      setError('Неверный пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  const fetchSettings = async () => {
    setIsSettingsLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is empty result
          console.error('Error fetching settings:', error);
        }
      } else if (data) {
        setSettings(data);
      }
    } finally {
      setIsSettingsLoading(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: settings.id || '00000000-0000-0000-0000-000000000001',
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      alert('Настройки успешно сохранены!');
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении настроек');
    } finally {
      setUploading(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const handleUpload = async (file: File, prefix: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${prefix}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleEdit = (project: DatabaseProject) => {
    setEditMode(true);
    setEditingId(project.id);
    
    // Поддержка старых проектов при редактировании (заполняем мультиязычные поля из старых одиночных)
    setNewProject({
      title_uk: project.title_uk || project.title || '',
      title_ru: project.title_ru || project.title || '',
      title_en: project.title_en || project.title || '',
      client: project.client || '',
      category_uk: project.category_uk || project.category || '',
      category_ru: project.category_ru || project.category || '',
      category_en: project.category_en || project.category || '',
      description_uk: project.description_uk || project.description || '',
      description_ru: project.description_ru || project.description || '',
      description_en: project.description_en || project.description || '',
      services_uk: project.services_uk?.join(', ') || project.services?.join(', ') || '',
      services_ru: project.services_ru?.join(', ') || project.services?.join(', ') || '',
      services_en: project.services_en?.join(', ') || project.services?.join(', ') || '',
      content_uk: project.content_uk || '',
      content_ru: project.content_ru || '',
      content_en: project.content_en || '',
    });
    setBeforePreview(project.before_image);
    setAfterPreview(project.after_image);
    setAdditionalPreviews(project.additional_images || []);
    setIsAdding(true);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditMode(false);
    setEditingId(null);
    setNewProject({ 
      title_uk: '', title_ru: '', title_en: '',
      client: '',
      category_uk: '', category_ru: '', category_en: '',
      description_uk: '', description_ru: '', description_en: '',
      services_uk: '', services_ru: '', services_en: '',
      content_uk: '', content_ru: '', content_en: '',
    });
    setBeforeFile(null);
    setAfterFile(null);
    setAdditionalFiles([]);
    setBeforePreview(null);
    setAfterPreview(null);
    setAdditionalPreviews([]);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editMode && (!beforeFile || !afterFile)) {
      setError('Пожалуйста, выберите оба изображения (До и После)');
      return;
    }

    setUploading(true);
    setError('');

    try {
      let beforeUrl = beforePreview;
      let afterUrl = afterPreview;

      if (beforeFile) {
        beforeUrl = await handleUpload(beforeFile, 'before');
      }
      if (afterFile) {
        afterUrl = await handleUpload(afterFile, 'after');
      }

      // Загрузка дополнительных фото
      const uploadedAdditionalUrls = [];
      for (const file of additionalFiles) {
        const url = await handleUpload(file, 'extra');
        uploadedAdditionalUrls.push(url);
      }

      // Комбинируем новые загруженные фото с уже существующими (при редактировании)
      const finalAdditionalImages = [
        ...additionalPreviews.filter(url => !url.startsWith('blob:')), // Сохраняем старые URL (не превью)
        ...uploadedAdditionalUrls
      ];

      const projectData = {
        title_uk: newProject.title_uk,
        title_ru: newProject.title_ru,
        title_en: newProject.title_en,
        client: newProject.client,
        category_uk: newProject.category_uk,
        category_ru: newProject.category_ru,
        category_en: newProject.category_en,
        description_uk: newProject.description_uk,
        description_ru: newProject.description_ru,
        description_en: newProject.description_en,
        services_uk: newProject.services_uk.split(',').map(s => s.trim()).filter(s => s !== ''),
        services_ru: newProject.services_ru.split(',').map(s => s.trim()).filter(s => s !== ''),
        services_en: newProject.services_en.split(',').map(s => s.trim()).filter(s => s !== ''),
        content_uk: newProject.content_uk,
        content_ru: newProject.content_ru,
        content_en: newProject.content_en,
        before_image: beforeUrl,
        after_image: afterUrl,
        additional_images: finalAdditionalImages,
      };

      if (editMode && editingId) {
        const { error: updateError } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingId);
        
        if (updateError) throw updateError;
        alert('Проект успешно обновлен!');
      } else {
        const { error: insertError } = await supabase
          .from('projects')
          .insert([projectData]);
        
        if (insertError) throw insertError;
        alert('Проект успешно сохранен и опубликован!');
      }

      resetForm();
      fetchProjects();
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении проекта');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот проект?')) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Ошибка при удалении');
    } else {
      fetchProjects();
    }
  };

  const migrateData = async () => {
    if (!confirm('Это загрузит все проекты из data.ts в базу данных. Продолжить?')) return;
    
    setLoading(true);
    try {
      const projectsToInsert = portfolioData.portfolio.map(p => ({
        title_uk: p.title,
        title_ru: p.title,
        title_en: p.title,
        client: p.client,
        category_uk: p.category,
        category_ru: p.category,
        category_en: p.category,
        description_uk: p.description,
        description_ru: p.description,
        description_en: p.description,
        services_uk: p.services,
        services_ru: p.services,
        services_en: p.services,
        before_image: p.beforeImage,
        after_image: p.afterImage,
      }));

      const { error } = await supabase.from('projects').insert(projectsToInsert);
      if (error) throw error;
      
      alert('Миграция успешна!');
      fetchProjects();
    } catch (err: any) {
      alert('Ошибка миграции: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-[#141414] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#FFB800] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#FFB800]/20">
              <LogOut className="text-black w-8 h-8 rotate-180" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Вход в панель</h1>
            <p className="text-white/40 text-sm">Введите пароль администратора</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFB800]/50 transition-colors"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-[#FFB800] transition-colors"
            >
              Войти
            </button>
          </form>
          
          <Link to="/" className="flex items-center justify-center gap-2 text-white/40 mt-6 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} />
            Вернуться на сайт
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#141414]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFB800] rounded-xl flex items-center justify-center shadow-lg shadow-[#FFB800]/10">
              <LogOut className="text-black w-5 h-5 rotate-180" />
            </div>
            <div>
              <h2 className="font-bold leading-none">Admin Panel</h2>
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Portfolio Manager</span>
            </div>
          </div>

          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mx-4">
            <button
              onClick={() => setAdminTab('projects')}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 ${adminTab === 'projects' ? 'bg-[#FFB800] text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              <Database size={14} />
              Кейсы
            </button>
            <button
              onClick={() => setAdminTab('settings')}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 ${adminTab === 'settings' ? 'bg-[#FFB800] text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              <Settings size={14} />
              Настройки
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={migrateData}
              className="hidden sm:block text-xs font-medium text-white/40 hover:text-[#FFB800] transition-colors"
            >
              Миграция из data.ts
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {adminTab === 'projects' ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">Проекты</h1>
            <p className="text-white/40">Управление вашим портфолио</p>
          </div>
          <button
            onClick={() => isAdding ? resetForm() : setIsAdding(true)}
            className="flex items-center justify-center gap-2 bg-[#FFB800] text-black font-bold px-6 py-3 rounded-2xl hover:bg-white transition-all shadow-lg shadow-[#FFB800]/10"
          >
            {isAdding ? <ArrowLeft size={20} /> : <Plus size={20} />}
            {isAdding ? 'Назад к списку' : 'Добавить кейс'}
          </button>
        </div>

        {isAdding ? (
          <div className="max-w-4xl bg-[#141414] border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {editMode ? <Pencil className="text-[#FFB800]" /> : <Plus className="text-[#FFB800]" />}
                {editMode ? 'Редактировать проект' : 'Новый проект'}
              </h2>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                {(['uk', 'ru', 'en'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setActiveLang(l)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeLang === l ? 'bg-[#FFB800] text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <Languages size={14} className="text-[#FFB800]" /> Название ({activeLang.toUpperCase()})
                    </label>
                    <input
                      required
                      value={newProject[`title_${activeLang}` as keyof typeof newProject]}
                      onChange={e => setNewProject({...newProject, [`title_${activeLang}`]: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#FFB800]/50 outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Клиент (общий)</label>
                    <input
                      required
                      value={newProject.client}
                      onChange={e => setNewProject({...newProject, client: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#FFB800]/50 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <Languages size={14} className="text-[#FFB800]" /> Категория ({activeLang.toUpperCase()})
                    </label>
                    <input
                      required
                      value={newProject[`category_${activeLang}` as keyof typeof newProject]}
                      onChange={e => setNewProject({...newProject, [`category_${activeLang}`]: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#FFB800]/50 outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <Languages size={14} className="text-[#FFB800]" /> Услуги ({activeLang.toUpperCase()})
                    </label>
                    <input
                      required
                      value={newProject[`services_${activeLang}` as keyof typeof newProject]}
                      onChange={e => setNewProject({...newProject, [`services_${activeLang}`]: e.target.value})}
                      placeholder="Через запятую"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#FFB800]/50 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <Languages size={14} className="text-[#FFB800]" /> Описание ({activeLang.toUpperCase()})
                </label>
                <textarea
                  required
                  rows={3}
                  value={newProject[`description_${activeLang}` as keyof typeof newProject]}
                  onChange={e => setNewProject({...newProject, [`description_${activeLang}`]: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#FFB800]/50 outline-none transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <Languages size={14} className="text-[#FFB800]" /> Расширенная история кейса ({activeLang.toUpperCase()})
                </label>
                <textarea
                  rows={6}
                  value={newProject[`content_${activeLang}` as keyof typeof newProject]}
                  onChange={e => setNewProject({...newProject, [`content_${activeLang}`]: e.target.value})}
                  placeholder="Опишите детали работы, сложности и результаты для детальной страницы..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#FFB800]/50 outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 uppercase tracking-widest">Фото ДО</label>
                  <label className="group relative block aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-white/10 hover:border-[#FFB800]/30 transition-all">
                    {beforeFile ? (
                      <img src={URL.createObjectURL(beforeFile)} className="h-full w-full object-cover" alt="Before preview" />
                    ) : beforePreview ? (
                      <img src={beforePreview} className="h-full w-full object-cover" alt="Current before" />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 bg-white/5">
                        <ImageIcon className="text-white/20 group-hover:text-[#FFB800]" size={32} />
                        <span className="text-[10px] text-white/20 font-bold uppercase">Загрузить</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      const file = e.target.files?.[0] || null;
                      setBeforeFile(file);
                      if (file) setBeforePreview(URL.createObjectURL(file));
                    }} />
                  </label>
                  {(beforeFile || beforePreview) && <p className="text-[10px] text-white/20 text-center">Нажмите, чтобы изменить</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 uppercase tracking-widest">Фото ПОСЛЕ</label>
                  <label className="group relative block aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-white/10 hover:border-[#FFB800]/30 transition-all">
                    {afterFile ? (
                      <img src={URL.createObjectURL(afterFile)} className="h-full w-full object-cover" alt="After preview" />
                    ) : afterPreview ? (
                      <img src={afterPreview} className="h-full w-full object-cover" alt="Current after" />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 bg-white/5">
                        <ImageIcon className="text-white/20 group-hover:text-[#FFB800]" size={32} />
                        <span className="text-[10px] text-white/20 font-bold uppercase">Загрузить</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      const file = e.target.files?.[0] || null;
                      setAfterFile(file);
                      if (file) setAfterPreview(URL.createObjectURL(file));
                    }} />
                  </label>
                  {(afterFile || afterPreview) && <p className="text-[10px] text-white/20 text-center">Нажмите, чтобы изменить</p>}
                </div>
              </div>

              {/* Дополнительные изображения */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <label className="text-sm font-medium text-white/60 uppercase tracking-widest">Галерея дополнительных фото</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {/* Существующие и новые превью */}
                  {additionalPreviews.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                      <img src={url} className="w-full h-full object-cover" alt={`Extra ${idx}`} />
                      <button
                        type="button"
                        onClick={() => {
                          const newPreviews = [...additionalPreviews];
                          newPreviews.splice(idx, 1);
                          setAdditionalPreviews(newPreviews);
                          
                          // Если это был только что выбранный файл, удаляем его и из списка файлов
                          if (url.startsWith('blob:')) {
                            const fileIdx = additionalFiles.findIndex(f => URL.createObjectURL(f) === url);
                            if (fileIdx !== -1) {
                              const newFiles = [...additionalFiles];
                              newFiles.splice(fileIdx, 1);
                              setAdditionalFiles(newFiles);
                            }
                          }
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Кнопка добавления */}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-[#FFB800]/30 transition-all flex flex-col items-center justify-center cursor-pointer bg-white/5">
                    <Plus size={24} className="text-white/20" />
                    <span className="text-[10px] text-white/20 font-bold uppercase mt-2">Добавить</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const files = Array.from(e.target.files || []);
                        setAdditionalFiles(prev => [...prev, ...files]);
                        const newPreviews = files.map(f => URL.createObjectURL(f));
                        setAdditionalPreviews(prev => [...prev, ...newPreviews]);
                      }}
                    />
                  </label>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-[#FFB800] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {uploading ? <Loader2 className="animate-spin" /> : editMode ? <Check size={24} /> : <Check size={24} />}
                {uploading ? 'СОХРАНЕНИЕ...' : editMode ? 'ОБНОВИТЬ ПРОЕКТ' : 'ОПУБЛИКОВАТЬ КЕЙС'}
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-white/20">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p>Загрузка данных...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="col-span-full py-20 bg-[#141414] rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center px-6">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Database size={40} className="text-white/10" />
                </div>
                <h3 className="text-xl font-bold mb-2">База данных пуста</h3>
                <p className="text-white/40 mb-8 max-w-sm mx-auto">
                  Вы можете начать добавлять свои проекты вручную или импортировать стандартные кейсы-заглушки.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => setIsAdding(true)} 
                    className="flex items-center gap-2 bg-[#FFB800] text-black font-bold px-8 py-4 rounded-2xl hover:bg-white transition-all w-full sm:w-auto"
                  >
                    <Plus size={20} /> Создать первый кейс
                  </button>
                  <button 
                    onClick={migrateData} 
                    className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all w-full sm:w-auto"
                  >
                    <Database size={20} /> Импорт заглушек
                  </button>
                </div>
              </div>
            ) : (
              projects.map(project => (
                <div key={project.id} className="group bg-[#141414] border border-white/10 rounded-2xl overflow-hidden hover:border-[#FFB800]/30 transition-all flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={project.after_image} alt={project.title_ru} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="bg-white text-black p-2.5 rounded-xl hover:bg-[#FFB800] transition-colors shadow-lg flex items-center gap-2 font-bold text-xs"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="bg-red-500/20 backdrop-blur-md text-red-500 border border-red-500/30 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg mb-1 leading-tight line-clamp-1">{project.title_ru || project.title_uk || project.title_en}</h3>
                    <p className="text-white/40 text-[10px] mb-3 uppercase tracking-[0.2em] font-black">{project.category_ru}</p>
                    <p className="text-white/60 text-sm line-clamp-2 mb-4 leading-relaxed font-medium">{project.description_ru}</p>
                    <div className="mt-auto flex flex-wrap gap-2">
                      {project.services_ru?.slice(0, 3).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] text-white/40 uppercase font-black">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        ) : (
          <div className="max-w-4xl">
            <div className="mb-10">
              <h1 className="text-3xl font-bold mb-1">Настройки сайта</h1>
              <p className="text-white/40">Управление контактами и общей информацией</p>
            </div>

            <div className="bg-[#141414] border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Settings className="text-[#FFB800]" />
                  Общие контакты
                </h2>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  {(['uk', 'ru', 'en'] as const).map(l => (
                    <button
                      key={l}
                      onClick={() => setActiveLang(l)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeLang === l ? 'bg-[#FFB800] text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <Mail size={14} className="text-[#FFB800]" /> Email
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={e => setSettings({...settings, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#FFB800]/50 outline-none transition-colors"
                      placeholder="daria.koval@creator.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <Phone size={14} className="text-[#FFB800]" /> Телефон
                    </label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={e => setSettings({...settings, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#FFB800]/50 outline-none transition-colors"
                      placeholder="+38 (000) 000-00-00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                    <MapPin size={14} className="text-[#FFB800]" /> Локация ({activeLang.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={settings[`location_${activeLang}` as keyof SiteSettings] as string}
                    onChange={e => setSettings({...settings, [`location_${activeLang}`]: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#FFB800]/50 outline-none transition-colors"
                    placeholder="Київ, Україна"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <Instagram size={14} className="text-[#FFB800]" /> Instagram URL
                    </label>
                    <input
                      type="url"
                      value={settings.instagram_url}
                      onChange={e => setSettings({...settings, instagram_url: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#FFB800]/50 outline-none transition-colors"
                      placeholder="https://instagram.com/daria_creator"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <Send size={14} className="text-[#FFB800]" /> Telegram Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">@</span>
                      <input
                        type="text"
                        value={settings.telegram_user}
                        onChange={e => setSettings({...settings, telegram_user: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 focus:border-[#FFB800]/50 outline-none transition-colors"
                        placeholder="daria_creative"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-[#FFB800] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="animate-spin" /> : <Check size={24} />}
                  {uploading ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ НАСТРОЙКИ'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
