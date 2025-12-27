'use client'

import { VideoCard } from '@/components/video/VideoCard'
import { CategoryTabs } from '@/components/home/CategoryTabs'
import { useTrendingVideos } from '@/hooks/useData'
import { Flame, TrendingUp } from 'lucide-react'

export default function TrendingPage() {
  const { videos: trendingVideos, loading } = useTrendingVideos()

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Flame className="w-8 h-8 text-accent" />
          <h1 className="text-4xl font-bold text-white">В тренде</h1>
          <TrendingUp className="w-6 h-6 text-accent" />
        </div>
        <p className="text-gray-400 text-lg">
          Самые популярные видео на YouDumb прямо сейчас
        </p>
      </div>

      {/* Category Navigation */}
      <CategoryTabs />

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
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
      ) : trendingVideos.length === 0 ? (
        <div className="text-center py-12">
          <Flame className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Пока нет трендовых видео
          </h2>
          <p className="text-gray-400 mb-6">
            Загружайте видео и набирайте просмотры, чтобы попасть в тренды!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trendingVideos.map((video, index) => (
            <div key={video.id} className="relative">
              {/* Trending Badge */}
              <div className="absolute top-2 left-2 bg-accent text-black text-xs px-2 py-1 rounded-full font-medium z-10">
                #{index + 1} тренд
              </div>
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}