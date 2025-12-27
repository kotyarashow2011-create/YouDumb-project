'use client'

import { VideoCard } from '@/components/video/VideoCard'
import { useAuth } from '@/hooks/useAuth'
import { useVideos } from '@/hooks/useData'
import { CheckCircle, Users, Video, Calendar, Settings } from 'lucide-react'
import { formatViews } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'

interface ChannelPageProps {
  params: {
    id: string
  }
}

export default function ChannelPage({ params }: ChannelPageProps) {
  const { user: currentUser, isAuthenticated } = useAuth()
  const { videos, loading } = useVideos()
  const [activeTab, setActiveTab] = useState('videos')

  // Filter videos by channel owner
  const channelVideos = videos.filter(video => video.userId === params.id)
  const channelOwner = channelVideos[0]?.user

  const isOwnChannel = isAuthenticated && currentUser?.id === params.id

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Banner Skeleton */}
        <div className="h-48 bg-gray-800 animate-pulse"></div>
        
        {/* Channel Info Skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start space-x-6 mb-8">
            <div className="w-32 h-32 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-700 rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!channelOwner && channelVideos.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Канал не найден
          </h1>
          <p className="text-gray-400 mb-6">
            Возможно, канал не существует или был удален
          </p>
          <Link href="/" className="btn-primary">
            Вернуться на главную
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Channel Banner */}
      <div className="h-48 bg-gradient-to-r from-accent/20 to-orange-600/20 relative">
        <div className="absolute inset-0 bg-black/30"></div>
        {isOwnChannel && (
          <div className="absolute top-4 right-4">
            <button className="btn-secondary flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Настроить канал</span>
            </button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Channel Info */}
        <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-16 mb-8">
          {/* Avatar */}
          <div className="w-32 h-32 bg-gray-600 rounded-full border-4 border-background flex items-center justify-center flex-shrink-0">
            {channelOwner?.avatarUrl ? (
              <img
                src={channelOwner.avatarUrl}
                alt={channelOwner.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-4xl font-bold">
                {channelOwner?.displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Channel Details */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-3xl font-bold text-white">
                {channelOwner?.displayName || 'Неизвестный канал'}
              </h1>
              {channelOwner?.isVerified && (
                <CheckCircle className="w-6 h-6 text-accent" />
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-gray-400 text-sm mb-4">
              <span>{formatViews(channelOwner?.subscriberCount || 0)} подписчиков</span>
              <span>{channelVideos.length} видео</span>
              <span>
                <Calendar className="w-4 h-4 inline mr-1" />
                Создан {new Date().getFullYear()}
              </span>
            </div>

            <p className="text-gray-300 mb-4">
              Добро пожаловать на канал {channelOwner?.displayName}! 
              Здесь вы найдете интересный контент и полезные видео.
            </p>

            {!isOwnChannel && (
              <button
                disabled={!isAuthenticated}
                className={`btn-primary ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isAuthenticated ? 'Подписаться' : 'Войдите для подписки'}
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'videos'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4 inline mr-2" />
              Видео
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'about'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              О канале
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'videos' && (
          <div>
            {channelVideos.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">
                  {isOwnChannel ? 'У вас пока нет видео' : 'На канале пока нет видео'}
                </h2>
                <p className="text-gray-400 mb-6">
                  {isOwnChannel 
                    ? 'Загрузите свое первое видео, чтобы начать создавать контент'
                    : 'Подпишитесь, чтобы не пропустить первые видео'
                  }
                </p>
                {isOwnChannel && (
                  <Link href="/upload" className="btn-primary">
                    Загрузить видео
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {channelVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl">
            <div className="bg-surface rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">О канале</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  Добро пожаловать на канал {channelOwner?.displayName}! 
                  Этот канал создан для того, чтобы делиться интересным контентом 
                  и общаться с аудиторией.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-medium text-white mb-2">Статистика</h4>
                    <ul className="space-y-2 text-sm">
                      <li>Подписчиков: {formatViews(channelOwner?.subscriberCount || 0)}</li>
                      <li>Видео: {channelVideos.length}</li>
                      <li>Просмотров: {formatViews(channelVideos.reduce((sum, video) => sum + video.viewCount, 0))}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-white mb-2">Информация</h4>
                    <ul className="space-y-2 text-sm">
                      <li>Дата создания: {new Date().getFullYear()}</li>
                      <li>Страна: Россия</li>
                      <li>Язык: Русский</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}