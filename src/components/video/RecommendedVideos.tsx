'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatViews } from '@/lib/utils'

const recommendedVideos = [
  {
    id: 'rec-1',
    title: 'Секреты успешного YouTube канала',
    thumbnail: '/api/placeholder/168/94',
    duration: '8:45',
    views: 89000,
    uploadDate: '1 неделю назад',
    channel: {
      name: 'ТехноОбзор',
      verified: false
    }
  },
  {
    id: 'rec-2',
    title: 'Как монетизировать свой контент',
    thumbnail: '/api/placeholder/168/94',
    duration: '15:22',
    views: 234000,
    uploadDate: '3 дня назад',
    channel: {
      name: 'Бизнес Гуру',
      verified: true
    }
  },
  {
    id: 'rec-3',
    title: 'Лучшие программы для монтажа',
    thumbnail: '/api/placeholder/168/94',
    duration: '12:18',
    views: 156000,
    uploadDate: '5 дней назад',
    channel: {
      name: 'Видео Мастер',
      verified: false
    }
  },
  {
    id: 'rec-4',
    title: 'Создание миниатюр для видео',
    thumbnail: '/api/placeholder/168/94',
    duration: '9:33',
    views: 98000,
    uploadDate: '1 день назад',
    channel: {
      name: 'Дизайн Студия',
      verified: true
    }
  },
  {
    id: 'rec-5',
    title: 'Анализ трендов YouTube 2024',
    thumbnail: '/api/placeholder/168/94',
    duration: '18:45',
    views: 345000,
    uploadDate: '2 дня назад',
    channel: {
      name: 'Аналитик',
      verified: true
    }
  }
]

interface RecommendedVideosProps {
  currentVideoId: string
}

export function RecommendedVideos({ currentVideoId }: RecommendedVideosProps) {
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
            <Image
              src={video.thumbnail}
              alt={video.title}
              width={168}
              height={94}
              className="rounded-lg object-cover"
            />
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
              {video.duration}
            </div>
          </div>
          
          {/* Video Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white text-sm font-medium line-clamp-2 mb-1 group-hover:text-accent transition-colors">
              {video.title}
            </h4>
            
            <p className="text-gray-400 text-xs mb-1">
              {video.channel.name}
            </p>
            
            <p className="text-gray-400 text-xs">
              {formatViews(video.views)} просмотров • {video.uploadDate}
            </p>
          </div>
        </Link>
      ))}
      
      {/* Load More */}
      <button className="w-full py-2 text-accent text-sm hover:underline">
        Показать еще
      </button>
    </div>
  )
}