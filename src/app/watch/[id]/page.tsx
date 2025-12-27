'use client'

import { VideoPlayer } from '@/components/video/VideoPlayer'
import { VideoInfo } from '@/components/video/VideoInfo'
import { CommentSection } from '@/components/video/CommentSection'
import { RecommendedVideos } from '@/components/video/RecommendedVideos'
import { useVideo } from '@/hooks/useData'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'

interface WatchPageProps {
  params: {
    id: string
  }
}

export default function WatchPage({ params }: WatchPageProps) {
  const { video, loading, incrementViews } = useVideo(params.id)
  const { user } = useAuth()

  useEffect(() => {
    if (video) {
      // Increment view count when video loads and add to history
      incrementViews(user?.id)
    }
  }, [video, incrementViews, user?.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Video Player Skeleton */}
              <div className="aspect-video bg-gray-800 rounded-lg animate-pulse mb-4"></div>
              
              {/* Video Info Skeleton */}
              <div className="space-y-4">
                <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-gray-700 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              {/* Recommended Videos Skeleton */}
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex space-x-3 animate-pulse">
                    <div className="w-40 h-24 bg-gray-700 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Видео не найдено
          </h1>
          <p className="text-gray-400 mb-6">
            Возможно, видео было удалено или ссылка неверна
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn-primary"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <VideoPlayer video={video} />
            
            {/* Video Info */}
            <VideoInfo video={video} />
            
            {/* Comments */}
            <CommentSection videoId={params.id} />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <RecommendedVideos currentVideoId={params.id} />
          </div>
        </div>
      </div>
    </div>
  )
}