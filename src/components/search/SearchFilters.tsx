'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'

export function SearchFilters() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const filterCategories = [
    {
      title: 'Тип контента',
      key: 'type',
      options: [
        { value: 'video', label: 'Видео' },
        { value: 'channel', label: 'Каналы' },
        { value: 'playlist', label: 'Плейлисты' }
      ]
    },
    {
      title: 'Продолжительность',
      key: 'duration',
      options: [
        { value: 'short', label: 'Менее 4 минут' },
        { value: 'medium', label: '4-20 минут' },
        { value: 'long', label: 'Более 20 минут' }
      ]
    },
    {
      title: 'Дата загрузки',
      key: 'upload_date',
      options: [
        { value: 'hour', label: 'Последний час' },
        { value: 'today', label: 'Сегодня' },
        { value: 'week', label: 'Эта неделя' },
        { value: 'month', label: 'Этот месяц' },
        { value: 'year', label: 'Этот год' }
      ]
    },
    {
      title: 'Категория',
      key: 'category',
      options: [
        { value: 'gaming', label: 'Игры' },
        { value: 'music', label: 'Музыка' },
        { value: 'education', label: 'Образование' },
        { value: 'entertainment', label: 'Развлечения' },
        { value: 'news', label: 'Новости' },
        { value: 'sports', label: 'Спорт' },
        { value: 'technology', label: 'Технологии' },
        { value: 'cooking', label: 'Кулинария' },
        { value: 'travel', label: 'Путешествия' }
      ]
    },
    {
      title: 'Особенности',
      key: 'features',
      options: [
        { value: 'hd', label: 'HD качество' },
        { value: 'subtitles', label: 'Субтитры' },
        { value: 'creative_commons', label: 'Creative Commons' },
        { value: 'live', label: 'Прямой эфир' }
      ]
    }
  ]

  const handleFilterChange = (category: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? '' : value
    }))
  }

  const clearAllFilters = () => {
    setActiveFilters({})
  }

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== '')

  return (
    <div className="bg-surface rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-accent" />
          <h3 className="text-white font-medium">Фильтры</h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-accent text-sm hover:underline"
          >
            Очистить все
          </button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mb-4 pb-4 border-b border-gray-600">
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => {
              if (!value) return null
              
              const category = filterCategories.find(cat => cat.key === key)
              const option = category?.options.find(opt => opt.value === value)
              
              return (
                <span
                  key={`${key}-${value}`}
                  className="inline-flex items-center space-x-1 bg-accent text-black px-2 py-1 rounded-full text-xs"
                >
                  <span>{option?.label}</span>
                  <button
                    onClick={() => handleFilterChange(key, value)}
                    className="hover:bg-orange-600 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Filter Categories */}
      <div className="space-y-6">
        {filterCategories.map((category) => (
          <div key={category.key}>
            <h4 className="text-white font-medium mb-3">{category.title}</h4>
            <div className="space-y-2">
              {category.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name={category.key}
                    value={option.value}
                    checked={activeFilters[category.key] === option.value}
                    onChange={() => handleFilterChange(category.key, option.value)}
                    className="text-accent focus:ring-accent focus:ring-offset-0"
                  />
                  <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}