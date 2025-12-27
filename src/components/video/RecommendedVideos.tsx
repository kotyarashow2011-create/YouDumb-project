'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatViews, formatUploadDate, formatDuration } from '@/lib/utils'
import { useVideos } from '@/hooks/useData'
import { Play } from 'lucide-react'

interface RecommendedVideosProps {
  currentVideoId: string
}

export function RecommendedVideos({ currentVideoId }: RecommendedVideosProps) {
  const { videos, loading } = useVideos()
  
  // Filter out current video and get recommendations
  const recommendedVideos = videos
    .filter(video => video.id !== currentVideoId)
    .slice(0, 10)

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Рекомендуемые видео
        </h3>
        
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex space-x-3 animate-pulse">
            <div className="w-40 h-24 bg-gray-700 rounded flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (recommendedVideos.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Рекомендуемые видео
        </h3>
        
        <div className="text-center py-8">
          <p className="text-gray-400">
            Нет рекомендуемых видео
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        Рекомендуемые видео
      </h3>
      
      {recommendedVideos.map((video) => (
        <Link
          key={video.id}
          href={`/watch/${video.id}`}
          className="flex space-x-3 group hover:bg-surface rounded-lg p-2 transition-colors"
        >
          {/* Thumbnail */}
          <div className="relative flex-shrink-0">
            <div className="w-40 h-24 bg-gray-800 rounded-lg overflow-hidden">
              {video.thumbnailUrl ? (
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  width={160}
                  height={90}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <Play className="w-8 h-8 text-gray-500" />
                </div>
              )}
            </div>
            
            {/* Duration */}
            {!video.isLive && (
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
                {formatDuration(video.duration)}
              </div>
            )}
            
            {/* Live indicator */}
            {video.isLive && (
              <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-2 py-1 rounded">
                LIVE
              </div>
            )}
          </div>
          
          {/* Video Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white text-sm font-medium line-clamp-2 mb-1 group-hover:text-accent transition-colors">
              {video.title}
            </h4>
            
            <p className="text-gray-400 text-xs mb-1">
              {video.user.displayName}
            </p>
            
            <p className="text-gray-400 text-xs">
              {formatViews(video.viewCount)} просмотров • {formatUploadDate(video.uploadDate)}
            </p>
          </div>
        </Link>
      ))}
      
      {/* Load More */}
      {recommendedVideos.length >= 10 && (
        <button className="w-full py-2 text-accent text-sm hover:underline">
          Показать еще
        </button>
      )}
    </div>
  )
}