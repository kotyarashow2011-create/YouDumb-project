import { VideoGrid } from '@/components/video/VideoGrid'
import { TrendingSection } from '@/components/home/TrendingSection'
import { CategoryTabs } from '@/components/home/CategoryTabs'

export default function HomePage() {
  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Добро пожаловать на YouDumb
        </h1>
        <p className="text-gray-400 text-lg">
          Откройте для себя лучшие видео от российских создателей контента
        </p>
      </div>

      {/* Category Navigation */}
      <CategoryTabs />

      {/* Trending Section */}
      <TrendingSection />

      {/* Main Video Grid */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Рекомендуемые видео
        </h2>
        <VideoGrid />
      </section>
    </div>
  )
}