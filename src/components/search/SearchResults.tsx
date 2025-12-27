'use client'

import { VideoCard } from '@/components/video/VideoCard'

const mockSearchResults = [
  {
    id: 'search-1',
    title: 'Как создать YouTube канал: полное руководство 2024',
    thumbnail: '/api/placeholder/320/180',
    duration: '25:34',
    views: 425000,
    uploadDate: '1 неделю назад',
    channel: {
      name: 'Блогер Академия',
      avatar: '/api/placeholder/40/40',
      verified: true
    }
  },
  {
    id: 'search-2',
    title: 'YouTube SEO: как продвигать видео в поиске',
    thumbnail: '/api/placeholder/320/180',
    duration: '18:22',
    views: 189000,
    uploadDate: '3 дня назад',
    channel: {
      name: 'SEO Эксперт',
      avatar: '/api/placeholder/40/40',
      verified: false
    }
  },
  {
    id: 'search-3',
    title: 'Монетизация YouTube канала: все способы заработка',
    thumbnail: '/api/placeholder/320/180',
    duration: '32:15',
    views: 567000,
    uploadDate: '2 недели назад',
    channel: {
      name: 'Заработок Онлайн',
      avatar: '/api/placeholder/40/40',
      verified: true
    }
  },
  {
    id: 'search-4',
    title: 'YouTube Shorts: как набрать миллион просмотров',
    thumbnail: '/api/placeholder/320/180',
    duration: '12:45',
    views: 892000,
    uploadDate: '5 дней назад',
    channel: {
      name: 'Вирусный Контент',
      avatar: '/api/placeholder/40/40',
      verified: true
    }
  },
  {
    id: 'search-5',
    title: 'Оборудование для YouTube: что нужно начинающему блогеру',
    thumbnail: '/api/placeholder/320/180',
    duration: '22:08',
    views: 234000,
    uploadDate: '1 день назад',
    channel: {
      name: 'Техно Обзоры',
      avatar: '/api/placeholder/40/40',
      verified: false
    }
  },
  {
    id: 'search-6',
    title: 'Психология YouTube: как удержать внимание зрителей',
    thumbnail: '/api/placeholder/320/180',
    duration: '28:33',
    views: 156000,
    uploadDate: '4 дня назад',
    channel: {
      name: 'Психология Медиа',
      avatar: '/api/placeholder/40/40',
      verified: true
    }
  }
]

interface SearchResultsProps {
  query: string
  filters: {
    category?: string
    duration?: string
    sort?: string
  }
}

export function SearchResults({ query, filters }: SearchResultsProps) {
  if (!query) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-4">
          Введите запрос для поиска видео
        </div>
        <p className="text-gray-500">
          Используйте поисковую строку выше для поиска интересующего контента
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <div className="text-gray-400 text-sm">
          Показано 1-6 из 1,234 результатов
        </div>
        
        <select className="bg-surface border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent">
          <option value="relevance">По релевантности</option>
          <option value="date">По дате загрузки</option>
          <option value="views">По количеству просмотров</option>
          <option value="rating">По рейтингу</option>
        </select>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSearchResults.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-8">
        <button className="btn-secondary">
          Загрузить еще результаты
        </button>
      </div>
    </div>
  )
}