'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const categories = [
  'Все',
  'Музыка',
  'Игры',
  'Новости',
  'Спорт',
  'Образование',
  'Технологии',
  'Кулинария',
  'Путешествия',
  'Комедия',
  'Фильмы',
  'Автомобили'
]

export function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState('Все')

  return (
    <div className="mb-6">
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              activeCategory === category
                ? 'bg-accent text-black'
                : 'bg-surface text-white hover:bg-gray-700'
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}