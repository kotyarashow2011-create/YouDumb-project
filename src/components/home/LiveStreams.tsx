'use client'

import { Radio } from 'lucide-react'
import { VideoCard } from '@/components/video/VideoCard'
import { useLiveStreams } from '@/hooks/useData'

export function LiveStreams() {
  const { streams, loading } = useLiveStreams()

  if (loading || streams.length === 0) {
    return null
  }

  return (
    <section className="mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center space-x-2">
          <Radio className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-semibold text-white">Прямые трансляции</h2>
        </div>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      </div>

      {/* Live Streams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {streams.map((stream) => (
          <VideoCard key={stream.id} video={stream} />
        ))}
      </div>

      {/* View All Streams */}
      <div className="mt-6 text-center">
        <button className="btn-secondary">
          Посмотреть все трансляции
        </button>
      </div>
    </section>
  )
}