'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { Settings, User, Bell, Shield, Palette, Globe, LogOut, Edit } from 'lucide-react'
import { ProfileEditForm } from '@/components/profile/ProfileEditForm'
import Link from 'next/link'

export default function SettingsPage() {
  const { isAuthenticated, user, logout } = useAuth()
  const { requestPermission } = useNotifications(user?.id)
  const [activeTab, setActiveTab] = useState('profile')
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [settings, setSettings] = useState({
    notifications: {
      newVideos: true,
      comments: true,
      likes: false,
      email: false,
      browser: true
    },
    privacy: {
      publicProfile: true,
      watchHistory: true,
      recommendations: true
    },
    appearance: {
      theme: 'dark',
      textSize: 'medium'
    },
    language: {
      interface: 'ru',
      region: 'ru',
      timezone: 'GMT+3'
    }
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Settings className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Войдите, чтобы изменить настройки
          </h1>
          <p className="text-gray-400 mb-6">
            Настройте свой профиль и предпочтения
          </p>
          <div className="space-x-4">
            <Link href="/auth/login" className="btn-primary">
              Войти
            </Link>
            <Link href="/auth/register" className="btn-secondary">
              Регистрация
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: User },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'privacy', label: 'Приватность', icon: Shield },
    { id: 'appearance', label: 'Внешний вид', icon: Palette },
    { id: 'language', label: 'Язык', icon: Globe },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Настройки</h1>
          <p className="text-gray-400">
            Управляйте своим аккаунтом и предпочтениями
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-accent text-black font-medium'
                        : 'text-white hover:bg-surface'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
              
              {/* Logout */}
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-400 hover:bg-red-900/20 transition-colors mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span>Выйти</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-surface rounded-lg p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">Профиль</h2>
                  
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Аватар
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                          {user?.avatarUrl ? (
                            <img 
                              src={user.avatarUrl} 
                              alt={user.displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-xl font-bold">
                              {user?.displayName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={() => setShowProfileEdit(true)}
                          className="btn-secondary flex items-center space-x-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Редактировать профиль</span>
                        </button>
                      </div>
                    </div>

                    {/* Display Name */}
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Отображаемое имя
                      </label>
                      <input
                        type="text"
                        value={user?.displayName}
                        className="input-primary w-full max-w-md"
                        readOnly
                      />
                      <p className="text-gray-400 text-sm mt-1">
                        Используйте кнопку "Редактировать профиль" для изменения
                      </p>
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Имя пользователя
                      </label>
                      <input
                        type="text"
                        value={user?.username}
                        className="input-primary w-full max-w-md"
                        readOnly
                      />
                      <p className="text-gray-400 text-sm mt-1">
                        youtu.be/@{user?.username}
                      </p>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email}
                        className="input-primary w-full max-w-md"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">Уведомления</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Браузерные уведомления</h3>
                        <p className="text-gray-400 text-sm">
                          Показывать уведомления в браузере
                        </p>
                      </div>
                      <button
                        onClick={requestPermission}
                        className="btn-secondary text-sm"
                      >
                        Разрешить
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Новые видео</h3>
                        <p className="text-gray-400 text-sm">
                          Уведомления о новых видео от подписок
                        </p>
                      </div>
                      <input 
                        type="checkbox" 
                        className="toggle" 
                        checked={settings.notifications.newVideos}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, newVideos: e.target.checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Комментарии</h3>
                        <p className="text-gray-400 text-sm">
                          Уведомления о новых комментариях к вашим видео
                        </p>
                      </div>
                      <input 
                        type="checkbox" 
                        className="toggle" 
                        checked={settings.notifications.comments}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, comments: e.target.checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Лайки</h3>
                        <p className="text-gray-400 text-sm">
                          Уведомления о лайках ваших видео
                        </p>
                      </div>
                      <input 
                        type="checkbox" 
                        className="toggle" 
                        checked={settings.notifications.likes}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, likes: e.target.checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Email уведомления</h3>
                        <p className="text-gray-400 text-sm">
                          Получать уведомления на email
                        </p>
                      </div>
                      <input 
                        type="checkbox" 
                        className="toggle" 
                        checked={settings.notifications.email}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: e.target.checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">Приватность</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Публичный профиль</h3>
                        <p className="text-gray-400 text-sm">
                          Разрешить другим пользователям видеть ваш профиль
                        </p>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">История просмотров</h3>
                        <p className="text-gray-400 text-sm">
                          Сохранять историю просмотренных видео
                        </p>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Рекомендации</h3>
                        <p className="text-gray-400 text-sm">
                          Использовать историю для персонализации рекомендаций
                        </p>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">Внешний вид</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-medium mb-3">Тема</h3>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-3">
                          <input type="radio" name="theme" value="dark" defaultChecked />
                          <span className="text-white">Темная (по умолчанию)</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="radio" name="theme" value="light" disabled />
                          <span className="text-gray-500">Светлая (скоро)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-medium mb-3">Размер текста</h3>
                      <select className="input-primary">
                        <option>Маленький</option>
                        <option selected>Средний</option>
                        <option>Большой</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'language' && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">Язык и регион</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Язык интерфейса
                      </label>
                      <select className="input-primary w-full max-w-md">
                        <option value="ru" selected>Русский</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Регион
                      </label>
                      <select className="input-primary w-full max-w-md">
                        <option value="ru" selected>Россия</option>
                        <option value="by">Беларусь</option>
                        <option value="kz">Казахстан</option>
                        <option value="ua">Украина</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Часовой пояс
                      </label>
                      <select className="input-primary w-full max-w-md">
                        <option selected>GMT+3 (Москва)</option>
                        <option>GMT+2 (Калининград)</option>
                        <option>GMT+4 (Самара)</option>
                        <option>GMT+5 (Екатеринбург)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <ProfileEditForm onClose={() => setShowProfileEdit(false)} />
      )}
    </div>
  )
}