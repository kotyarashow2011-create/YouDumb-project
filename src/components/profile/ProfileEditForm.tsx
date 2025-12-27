'use client'

import { useState, useRef } from 'react'
import { Camera, Save, X, Upload } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { authManager } from '@/lib/auth'

interface ProfileData {
  displayName: string
  username: string
  email: string
  bio: string
  avatarUrl?: string
  bannerUrl?: string
}

interface ProfileEditFormProps {
  onClose: () => void
}

export function ProfileEditForm({ onClose }: ProfileEditFormProps) {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: user?.displayName || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: '',
    avatarUrl: user?.avatarUrl,
    bannerUrl: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (file: File, type: 'avatar' | 'banner') => {
    if (!file) return

    // В реальном приложении здесь был бы загрузка на сервер
    // Для демо используем URL.createObjectURL
    const imageUrl = URL.createObjectURL(file)
    
    setProfileData(prev => ({
      ...prev,
      [type === 'avatar' ? 'avatarUrl' : 'bannerUrl']: imageUrl
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    try {
      // Обновляем пользователя в authManager
      const updatedUser = {
        ...user,
        displayName: profileData.displayName,
        username: profileData.username,
        email: profileData.email,
        avatarUrl: profileData.avatarUrl
      }

      // В реальном приложении здесь был бы API вызов
      // Для демо обновляем localStorage напрямую
      const authData = {
        user: updatedUser,
        isAuthenticated: true
      }
      localStorage.setItem('youdumb_auth', JSON.stringify(authData))
      
      // Принудительно обновляем состояние
      authManager.getAuthState().user = updatedUser
      
      onClose()
    } catch (error) {
      console.error('Ошибка обновления профиля:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Редактировать профиль</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Banner Upload */}
          <div className="space-y-2">
            <label className="block text-white font-medium">Баннер канала</label>
            <div className="relative">
              <div 
                className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => bannerInputRef.current?.click()}
                style={{
                  backgroundImage: profileData.bannerUrl ? `url(${profileData.bannerUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!profileData.bannerUrl && (
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Загрузить баннер</p>
                  </div>
                )}
              </div>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'banner')}
                className="hidden"
              />
            </div>
          </div>

          {/* Avatar Upload */}
          <div className="space-y-2">
            <label className="block text-white font-medium">Аватар</label>
            <div className="flex items-center space-x-4">
              <div 
                className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors relative overflow-hidden"
                onClick={() => avatarInputRef.current?.click()}
              >
                {profileData.avatarUrl ? (
                  <img 
                    src={profileData.avatarUrl} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Загрузить фото</span>
                </button>
                <p className="text-gray-400 text-sm mt-1">JPG, PNG до 5MB</p>
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'avatar')}
                className="hidden"
              />
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <label className="block text-white font-medium">Отображаемое имя</label>
            <input
              type="text"
              value={profileData.displayName}
              onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
              className="input-primary w-full"
              placeholder="Ваше имя"
              required
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="block text-white font-medium">Имя пользователя</label>
            <input
              type="text"
              value={profileData.username}
              onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
              className="input-primary w-full"
              placeholder="username"
              required
            />
            <p className="text-gray-400 text-sm">youtu.be/@{profileData.username}</p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-white font-medium">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              className="input-primary w-full"
              placeholder="email@example.com"
              required
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="block text-white font-medium">Описание канала</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              className="input-primary w-full h-24 resize-none"
              placeholder="Расскажите о своем канале..."
            />
            <p className="text-gray-400 text-sm">{profileData.bio.length}/1000</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
              disabled={isLoading}
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Сохранение...' : 'Сохранить'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}