import { SearchResults } from '@/components/search/SearchResults'
import { SearchFilters } from '@/components/search/SearchFilters'

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    duration?: string
    sort?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white mb-2">
            {query ? `Результаты поиска для "${query}"` : 'Поиск видео'}
          </h1>
          {query && (
            <p className="text-gray-400">
              Найдено результатов: 1,234
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters />
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <SearchResults query={query} filters={searchParams} />
          </div>
        </div>
      </div>
    </div>
  )
}