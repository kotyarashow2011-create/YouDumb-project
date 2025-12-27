'use client'

import { VideoCard } from '@/components/video/VideoCard'
import { useAuth } from '@/hooks/useAuth'
import { useVideos } from '@/hooks/useData'
import { Users, Bell } from 'lucide-react'
import Link from 'next/link'

export default function SubscriptionsPage() {
  const { isAuthenticated, user } = useAuth()
  const { videos, loading } = useVideos()

  if (!isAuthenticated) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Войдите, чтобы увидеть подписки
          </h1>
          <p className="text-gray-400 mb-6">
            Подпишитесь на каналы, чтобы не пропускать новые видео от любимых авторов
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
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-8 h-8 text-accent" />
          <h1 className="text-4xl font-bold text-white">Подписки</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Новые видео от ваших подписок
        </p>
      </div>

      {/* Notification Settings */}
      <div className="bg-surface rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-accent" />
            <div>
              <h3 className="text-white font-medium">Уведомления</h3>
              <p className="text-gray-400 text-sm">
                Получайте уведомления о новых видео
              </p>
            </div>
          </div>
          <button className="btn-secondary text-sm">
            Настроить
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">
            У вас пока нет подписок
          </h2>
          <p className="text-gray-400 mb-6">
            Найдите интересные каналы и подпишитесь, чтобы не пропускать новые видео
          </p>
          <Link href="/trending" className="btn-primary">
            Посмотреть популярные видео
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Latest Videos */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Последние видео
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.slice(0, 8).map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>

          {/* Load More */}
          {videos.length > 8 && (
            <div className="text-center">
              <button className="btn-secondary">
                Показать больше видео
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}