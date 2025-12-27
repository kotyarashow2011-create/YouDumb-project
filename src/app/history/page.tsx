'use client'

import { VideoCard } from '@/components/video/VideoCard'
import { useAuth } from '@/hooks/useAuth'
import { History, Trash2, Search } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { dataManager, Video } from '@/lib/data'

export default function HistoryPage() {
  const { isAuthenticated, user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setVideos([])
      setLoading(false)
      return
    }

    const updateHistory = () => {
      const history = dataManager.getWatchHistory(user.id)
      setVideos(history)
      setLoading(false)
    }

    updateHistory()
    const unsubscribe = dataManager.subscribe(updateHistory)
    return unsubscribe
  }, [isAuthenticated, user])

  const clearHistory = () => {
    if (!user || !confirm('Очистить всю историю просмотров?')) return
    
    // Очищаем историю для текущего пользователя
    dataManager.clearWatchHistory(user.id)
  }

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <History className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Войдите, чтобы увидеть историю
          </h1>
          <p className="text-gray-400 mb-6">
            Отслеживайте просмотренные видео и легко находите их снова
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <History className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-white">История просмотров</h1>
          </div>
          <button 
            onClick={clearHistory}
            className="btn-secondary flex items-center space-x-2"
            disabled={videos.length === 0}
          >
            <Trash2 className="w-4 h-4" />
            <span>Очистить историю</span>
          </button>
        </div>
        <p className="text-gray-400 text-lg">
          {videos.length > 0 
            ? `${videos.length} видео в истории`
            : 'История просмотров пуста'
          }
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск в истории..."
            className="w-full pl-10 pr-4 py-2 bg-surface border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-white text-lg">Загрузка...</div>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">
            {searchQuery ? 'Ничего не найдено' : 'История пуста'}
          </h2>
          <p className="text-gray-400 mb-6">
            {searchQuery 
              ? 'Попробуйте изменить поисковый запрос'
              : 'Начните смотреть видео, и они появятся здесь'
            }
          </p>
          {!searchQuery && (
            <Link href="/" className="btn-primary">
              Смотреть видео
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  )
}