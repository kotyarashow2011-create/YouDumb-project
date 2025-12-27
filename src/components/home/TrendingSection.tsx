'use client'

import { TrendingUp, Flame } from 'lucide-react'
import { VideoCard } from '@/components/video/VideoCard'
import { useTrendingVideos } from '@/hooks/useData'

export function TrendingSection() {
  const { videos: trendingVideos, loading } = useTrendingVideos()

  if (loading) {
    return (
      <section className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center space-x-2">
            <Flame className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-semibold text-white">В тренде</h2>
          </div>
          <TrendingUp className="w-5 h-5 text-accent" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
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
      </section>
    )
  }

  if (trendingVideos.length === 0) {
    return null
  }

  return (
    <section className="mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center space-x-2">
          <Flame className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-semibold text-white">В тренде</h2>
        </div>
        <TrendingUp className="w-5 h-5 text-accent" />
      </div>

      {/* Trending Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingVideos.slice(0, 6).map((video) => (
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