'use client'

import { useEffect } from 'react'
import { VideoGrid } from '@/components/video/VideoGrid'
import { TrendingSection } from '@/components/home/TrendingSection'
import { CategoryTabs } from '@/components/home/CategoryTabs'
import { LiveStreams } from '@/components/home/LiveStreams'
import { EmptyState } from '@/components/home/EmptyState'
import { useVideos, useTrendingVideos, useLiveStreams } from '@/hooks/useData'
import { seedTestData } from '@/lib/seedData'

export default function HomePage() {
  const { videos, loading } = useVideos()
  const { videos: trendingVideos } = useTrendingVideos()
  const { streams } = useLiveStreams()

  // Инициализируем тестовые данные при первом запуске
  useEffect(() => {
    if (typeof window !== 'undefined') {
      seedTestData()
    }
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Загрузка...</div>
      </div>
    )
  }

  if (videos.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Добро пожаловать на YouDumb
        </h1>
        <p className="text-gray-400 text-lg">
          Откройте для себя лучшие видео от российских создателей контента
        </p>
      </div>

      {/* Category Navigation */}
      <CategoryTabs />

      {/* Live Streams */}
      {streams.length > 0 && <LiveStreams />}

      {/* Trending Section */}
      {trendingVideos.length > 0 && <TrendingSection />}

      {/* Main Video Grid */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Все видео
        </h2>
        <VideoGrid />
      </section>
    </div>
  )
}