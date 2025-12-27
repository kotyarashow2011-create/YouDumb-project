'use client'

import { TrendingUp, Fire } from 'lucide-react'
import { VideoCard } from '@/components/video/VideoCard'

const trendingVideos = [
  {
    id: 'trending-1',
    title: 'BREAKING: Новые технологии в России 2024',
    thumbnail: '/api/placeholder/320/180',
    duration: '18:45',
    views: 1250000,
    uploadDate: '6 часов назад',
    channel: {
      name: 'Новости Технологий',
      avatar: '/api/placeholder/40/40',
      verified: true
    }
  },
  {
    id: 'trending-2',
    title: 'Самый популярный рецепт недели',
    thumbnail: '/api/placeholder/320/180',
    duration: '12:30',
    views: 890000,
    uploadDate: '1 день назад',
    channel: {
      name: 'Готовим Дома',
      avatar: '/api/placeholder/40/40',
      verified: true
    }
  },
  {
    id: 'trending-3',
    title: 'Обзор игры года - полный разбор',
    thumbnail: '/api/placeholder/320/180',
    duration: '35:22',
    views: 2100000,
    uploadDate: '2 дня назад',
    channel: {
      name: 'Игровой Канал',
      avatar: '/api/placeholder/40/40',
      verified: true
    }
  }
]

export function TrendingSection() {
  return (
    <section className="mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center space-x-2">
          <Fire className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-semibold text-white">В тренде</h2>
        </div>
        <TrendingUp className="w-5 h-5 text-accent" />
      </div>

      {/* Trending Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* View All Trending */}
      <div className="mt-6 text-center">
        <button className="btn-secondary">
          Посмотреть все трендовые видео
        </button>
      </div>
    </section>
  )
}