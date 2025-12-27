'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const clearSearch = () => {
    setQuery('')
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={`flex items-center bg-surface border rounded-full transition-all duration-200 ${
        isFocused ? 'border-accent' : 'border-gray-600'
      }`}>
        <div className="pl-4 pr-2">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Поиск видео..."
          className="flex-1 bg-transparent text-white placeholder-gray-400 py-2 px-2 focus:outline-none"
        />
        
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
        
        <button
          type="submit"
          className="bg-accent hover:bg-orange-600 text-black px-4 py-2 rounded-r-full transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Search Suggestions (placeholder for future implementation) */}
      {isFocused && query && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-gray-600 rounded-lg shadow-lg z-50">
          <div className="p-4 text-gray-400 text-sm">
            Поиск: "{query}"
          </div>
        </div>
      )}
    </form>
  )
}