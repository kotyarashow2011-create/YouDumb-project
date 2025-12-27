'use client'

import { VideoCard } from './VideoCard'

// Mock data for demonstration
const mockVideos = [
  {
    id: '1',
    title: 'Как создать свой YouTube канал в 2024 году',
    thumbnail: '/api/placeholder/320/180',
    duration: '12:34',
    views: 125000,
    uploadDate: '2 дня назад',
    channel: {
      name: 'Блогер Иван',
      avatar: '/api/placeholder/40/40',
      verified: true
    }
  },
  {
    id: '2',
    title: 'Обзор новых технологий в России',
    thumbnail: '/api/placeholder/320/180',
    duration: '8:45',
    views: 89000,
    uploadDate: '1 неделю назад',
    channel: {
      name: 'ТехноОбзор',
      avatar: '/api/placeholder/40/40',
      verified: false
    }
  },
  {
    id: '3',
    title: 'Готовим борщ по бабушкиному рецепту',
    thumbnail: '/api/placeholder/320/180',
    duration: '15:22',
    views: 234000,
    uploadDate: '3 дня назад',
    channel: {
      name: 'Кухня Марии',
      avatar: '/api/placeholder/40/40',
      verified: true
    }
  },
  {
    id: '4',
    title: 'Путешествие по Золотому кольцу России',
    thumbnail: '/api/placeholder/320/180',
    duration: '22:18',
    views: 156000,
    uploadDate: '5 дней назад',
    channel: {
      name: 'Путешественник',
      avatar: '/api/placeholder/40/40',
      verified: false
    }
  },
  {
    id: '5',
    title: 'Изучаем JavaScript с нуля',
    thumbnail: '/api/placeholder/320/180',
    duration: '45:12',
    views: 67000,
    uploadDate: '1 день назад',
    channel: {
      name: 'Код Академия',
      avatar: '/api/placeholder/40/40',
      verified: true
    }
  },
  {
    id: '6',
    title: 'Лучшие места для фотосессий в Москве',
    thumbnail: '/api/placeholder/320/180',
    duration: '9:33',
    views: 98000,
    uploadDate: '4 дня назад',
    channel: {
      name: 'Фото Мастер',
      avatar: '/api/placeholder/40/40',
      verified: false
    }
  }
]

export function VideoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {mockVideos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}