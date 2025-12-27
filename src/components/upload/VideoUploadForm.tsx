'use client'

import { useState, useRef } from 'react'
import { Upload, X, Play, Eye, EyeOff, Radio } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { dataManager } from '@/lib/data'
import { useRouter } from 'next/navigation'

interface VideoData {
  title: string
  description: string
  tags: string[]
  visibility: 'public' | 'unlisted' | 'private'
  category: string
  isLive: boolean
}

export function VideoUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [videoData, setVideoData] = useState<VideoData>({
    title: '',
    description: '',
    tags: [],
    visibility: 'public',
    category: '',
    isLive: false
  })
  const [tagInput, setTagInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">
          Требуется авторизация
        </h2>
        <p className="text-gray-400 mb-6">
          Войдите в аккаунт, чтобы загружать видео
        </p>
        <button
          onClick={() => router.push('/auth/login')}
          className="btn-primary"
        >
          Войти в аккаунт
        </button>
      </div>
    )
  }

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && (selectedFile.type.startsWith('video/') || videoData.isLive)) {
      setFile(selectedFile)
      if (!videoData.title) {
        setVideoData(prev => ({
          ...prev,
          title: selectedFile.name.replace(/\.[^/.]+$/, '')
        }))
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const addTag = () => {
    if (tagInput.trim() && !videoData.tags.includes(tagInput.trim())) {
      setVideoData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setVideoData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || (!file && !videoData.isLive) || !videoData.title) return

    setIsUploading(true)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          
          // Create the video
          const newVideo = dataManager.addVideo({
            title: videoData.title,
            description: videoData.description,
            thumbnailUrl: videoData.isLive 
              ? 'https://via.placeholder.com/320x180/f97316/000000?text=LIVE'
              : 'https://via.placeholder.com/320x180/1a1a1a/ffffff?text=VIDEO',
            videoUrl: videoData.isLive 
              ? 'https://example.com/live-stream'
              : 'https://example.com/video.mp4',
            duration: videoData.isLive ? 0 : Math.floor(Math.random() * 3600) + 60,
            userId: user.id,
            user: {
              id: user.id,
              username: user.username,
              displayName: user.displayName,
              avatarUrl: user.avatarUrl,
              isVerified: user.isVerified,
              subscriberCount: user.subscriberCount
            },
            tags: videoData.tags,
            status: 'published',
            category: videoData.category,
            isLive: videoData.isLive
          })

          setIsUploading(false)
          router.push(`/watch/${newVideo.id}`)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Live Stream Toggle */}
      <div className="bg-surface rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium mb-2">Тип контента</h3>
            <p className="text-gray-400 text-sm">
              Выберите, что вы хотите создать
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setVideoData(prev => ({ ...prev, isLive: false }))}
              className={`px-4 py-2 rounded-lg transition-colors ${
                !videoData.isLive 
                  ? 'bg-accent text-black' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Видео
            </button>
            <button
              type="button"
              onClick={() => setVideoData(prev => ({ ...prev, isLive: true }))}
              className={`px-4 py-2 rounded-lg transition-colors ${
                videoData.isLive 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <Radio className="w-4 h-4 inline mr-2" />
              Стрим
            </button>
          </div>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="bg-surface rounded-lg p-8">
        {!file && !videoData.isLive ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-accent transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Выберите файл для загрузки
            </h3>
            <p className="text-gray-400 mb-4">
              Перетащите видеофайл сюда или нажмите для выбора
            </p>
            <p className="text-gray-500 text-sm">
              Поддерживаемые форматы: MP4, WebM, AVI, MOV (макс. 2GB)
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </div>
        ) : videoData.isLive ? (
          <div className="text-center py-8">
            <Radio className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Прямая трансляция
            </h3>
            <p className="text-gray-400">
              Настройте детали трансляции ниже
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Play className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{file?.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {file ? (file.size / (1024 * 1024)).toFixed(1) : '0'} MB
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Загрузка...</span>
                  <span className="text-white">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video Details */}
      {(file || videoData.isLive) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white font-medium mb-2">
                {videoData.isLive ? 'Название трансляции' : 'Название видео'} *
              </label>
              <input
                type="text"
                value={videoData.title}
                onChange={(e) => setVideoData(prev => ({ ...prev, title: e.target.value }))}
                className="input-primary w-full"
                placeholder={videoData.isLive ? 'Введите название трансляции' : 'Введите название видео'}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-medium mb-2">
                Описание
              </label>
              <textarea
                value={videoData.description}
                onChange={(e) => setVideoData(prev => ({ ...prev, description: e.target.value }))}
                className="input-primary w-full h-32 resize-none"
                placeholder={videoData.isLive ? 'Расскажите о своей трансляции...' : 'Расскажите о своем видео...'}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-white font-medium mb-2">
                Теги
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="input-primary flex-1"
                    placeholder="Добавить тег"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="btn-secondary"
                  >
                    Добавить
                  </button>
                </div>
                
                {videoData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {videoData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-accent text-black px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:bg-orange-600 rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <label className="block text-white font-medium mb-2">
                Категория
              </label>
              <select
                value={videoData.category}
                onChange={(e) => setVideoData(prev => ({ ...prev, category: e.target.value }))}
                className="input-primary w-full"
              >
                <option value="">Выберите категорию</option>
                <option value="gaming">Игры</option>
                <option value="music">Музыка</option>
                <option value="education">Образование</option>
                <option value="entertainment">Развлечения</option>
                <option value="news">Новости</option>
                <option value="sports">Спорт</option>
                <option value="technology">Технологии</option>
                <option value="cooking">Кулинария</option>
                <option value="travel">Путешествия</option>
                <option value="other">Другое</option>
              </select>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-white font-medium mb-2">
                Видимость
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={videoData.visibility === 'public'}
                    onChange={(e) => setVideoData(prev => ({ ...prev, visibility: e.target.value as any }))}
                    className="text-accent"
                  />
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-white">Публичное</span>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="unlisted"
                    checked={videoData.visibility === 'unlisted'}
                    onChange={(e) => setVideoData(prev => ({ ...prev, visibility: e.target.value as any }))}
                    className="text-accent"
                  />
                  <div className="flex items-center space-x-2">
                    <EyeOff className="w-4 h-4 text-gray-400" />
                    <span className="text-white">По ссылке</span>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={videoData.visibility === 'private'}
                    onChange={(e) => setVideoData(prev => ({ ...prev, visibility: e.target.value as any }))}
                    className="text-accent"
                  />
                  <div className="flex items-center space-x-2">
                    <X className="w-4 h-4 text-gray-400" />
                    <span className="text-white">Приватное</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {(file || videoData.isLive) && (
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setFile(null)
              setVideoData(prev => ({ ...prev, isLive: false }))
            }}
            className="btn-secondary"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isUploading || !videoData.title}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading 
              ? 'Загрузка...' 
              : videoData.isLive 
                ? 'Начать трансляцию' 
                : 'Опубликовать видео'
            }
          </button>
        </div>
      )}
    </form>
  )
}