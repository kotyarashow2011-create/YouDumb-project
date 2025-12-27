'use client'

import { VideoCard } from '@/components/video/VideoCard'
import { useSearch } from '@/hooks/useData'

interface SearchResultsProps {
  query: string
  filters: {
    category?: string
    duration?: string
    sort?: string
  }
}

export function SearchResults({ query, filters }: SearchResultsProps) {
  const { results, loading } = useSearch(query)

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

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Sort Options Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="h-8 bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>

        {/* Results Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <div className="text-gray-400 text-sm">
          {results.length === 0 
            ? 'Ничего не найдено'
            : `Найдено ${results.length} ${results.length === 1 ? 'результат' : results.length < 5 ? 'результата' : 'результатов'}`
          }
        </div>
        
        {results.length > 0 && (
          <select className="bg-surface border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent">
            <option value="relevance">По релевантности</option>
            <option value="date">По дате загрузки</option>
            <option value="views">По количеству просмотров</option>
            <option value="rating">По рейтингу</option>
          </select>
        )}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            По запросу "{query}" ничего не найдено
          </div>
          <div className="text-gray-500 space-y-2">
            <p>Попробуйте:</p>
            <ul className="text-sm">
              <li>• Проверить правописание</li>
              <li>• Использовать более общие слова</li>
              <li>• Попробовать другие ключевые слова</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {/* Load More */}
          {results.length >= 10 && (
            <div className="text-center pt-8">
              <button className="btn-secondary">
                Загрузить еще результаты
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}