'use client'

import { VideoCard } from '@/components/video/VideoCard'
import { useAuth } from '@/hooks/useAuth'
import { Clock, Play } from 'lucide-react'
import Link from 'next/link'

export default function WatchLaterPage() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Clock className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Войдите, чтобы сохранять видео
          </h1>
          <p className="text-gray-400 mb-6">
            Сохраняйте интересные видео для просмотра позже
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
          <Clock className="w-8 h-8 text-accent" />
          <h1 className="text-4xl font-bold text-white">Посмотреть позже</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Видео, сохраненные для просмотра позже
        </p>
      </div>

      {/* Empty State */}
      <div className="text-center py-12">
        <Clock className="w-16 h-16 text-gray-600 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">
          Список пуст
        </h2>
        <p className="text-gray-400 mb-6">
          Сохраняйте видео для просмотра позже, нажимая на кнопку "Посмотреть позже" под видео
        </p>
        <Link href="/" className="btn-primary">
          Найти видео
        </Link>
      </div>
    </div>
  )
}