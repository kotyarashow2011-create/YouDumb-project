'use client'

import { VideoCard } from '@/components/video/VideoCard'
import { useAuth } from '@/hooks/useAuth'
import { ThumbsUp, Heart } from 'lucide-react'
import Link from 'next/link'

export default function LikedPage() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <ThumbsUp className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Войдите, чтобы увидеть понравившиеся видео
          </h1>
          <p className="text-gray-400 mb-6">
            Ставьте лайки видео, чтобы легко находить их позже
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
          <ThumbsUp className="w-8 h-8 text-accent" />
          <h1 className="text-4xl font-bold text-white">Понравившиеся видео</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Видео, которым вы поставили лайк
        </p>
      </div>

      {/* Empty State */}
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-600 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">
          Пока нет понравившихся видео
        </h2>
        <p className="text-gray-400 mb-6">
          Ставьте лайки видео, которые вам нравятся, и они появятся здесь
        </p>
        <Link href="/" className="btn-primary">
          Найти видео
        </Link>
      </div>
    </div>
  )
}