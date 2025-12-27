'use client'

import { VideoCard } from '@/components/video/VideoCard'
import { useAuth } from '@/hooks/useAuth'
import { useVideos } from '@/hooks/useData'
import { PlaySquare, Clock, ThumbsUp, History, Upload } from 'lucide-react'
import Link from 'next/link'

export default function LibraryPage() {
  const { isAuthenticated, user } = useAuth()
  const { videos, loading } = useVideos()

  if (!isAuthenticated) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <PlaySquare className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Войдите, чтобы увидеть библиотеку
          </h1>
          <p className="text-gray-400 mb-6">
            Сохраняйте видео для просмотра позже и отслеживайте историю просмотров
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

  // Filter user's videos
  const userVideos = videos.filter(video => video.userId === user?.id)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <PlaySquare className="w-8 h-8 text-accent" />
          <h1 className="text-4xl font-bold text-white">Библиотека</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Ваши видео, история и сохраненное
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          href="/upload"
          className="bg-surface hover:bg-gray-700 rounded-lg p-6 transition-colors group"
        >
          <Upload className="w-8 h-8 text-accent mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-medium mb-2">Загрузить видео</h3>
          <p className="text-gray-400 text-sm">Поделитесь своим контентом</p>
        </Link>

        <Link
          href="/history"
          className="bg-surface hover:bg-gray-700 rounded-lg p-6 transition-colors group"
        >
          <History className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-medium mb-2">История</h3>
          <p className="text-gray-400 text-sm">Просмотренные видео</p>
        </Link>

        <Link
          href="/watch-later"
          className="bg-surface hover:bg-gray-700 rounded-lg p-6 transition-colors group"
        >
          <Clock className="w-8 h-8 text-yellow-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-medium mb-2">Посмотреть позже</h3>
          <p className="text-gray-400 text-sm">Сохраненные видео</p>
        </Link>

        <Link
          href="/liked"
          className="bg-surface hover:bg-gray-700 rounded-lg p-6 transition-colors group"
        >
          <ThumbsUp className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-medium mb-2">Понравившиеся</h3>
          <p className="text-gray-400 text-sm">Оцененные видео</p>
        </Link>
      </div>

      {/* User's Videos */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Ваши видео ({userVideos.length})
          </h2>
          {userVideos.length > 0 && (
            <Link href={`/channel/${user?.id}`} className="text-accent hover:underline">
              Посмотреть все
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-700 aspect-video rounded-lg mb-3"></div>
                <div className="flex space-x-3">
                  <div className="w-9 h-9 bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : userVideos.length === 0 ? (
          <div className="text-center py-12 bg-surface rounded-lg">
            <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-4">
              У вас пока нет видео
            </h3>
            <p className="text-gray-400 mb-6">
              Загрузите свое первое видео и начните создавать контент
            </p>
            <Link href="/upload" className="btn-primary">
              Загрузить видео
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userVideos.slice(0, 8).map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">
          Недавняя активность
        </h2>
        <div className="bg-surface rounded-lg p-6 text-center">
          <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">
            Здесь будет отображаться ваша недавняя активность
          </p>
        </div>
      </section>
    </div>
  )
}