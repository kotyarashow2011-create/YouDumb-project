'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ThumbsUp, ThumbsDown, Share, Download, Flag, CheckCircle, Trash2, MoreVertical } from 'lucide-react'
import { formatViews, formatUploadDate } from '@/lib/utils'
import { Video, dataManager } from '@/lib/data'
import { useAuth } from '@/hooks/useAuth'
import { useVideo } from '@/hooks/useData'
import { useSubscription } from '@/hooks/useSubscription'
import { useRouter } from 'next/navigation'

interface VideoInfoProps {
  video: Video
}

export function VideoInfo({ video }: VideoInfoProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const { likeVideo, dislikeVideo, isLiked, isDisliked } = useVideo(video.id)
  const { isSubscribed, toggleSubscription } = useSubscription(user?.id, video.userId)
  const router = useRouter()

  const handleLike = () => {
    if (!isAuthenticated || !user) return
    likeVideo(user.id)
  }

  const handleDislike = () => {
    if (!isAuthenticated || !user) return
    dislikeVideo(user.id)
  }

  const handleShare = async () => {
    const url = window.location.href
    
    if (navigator.share) {
      // Используем Web Share API если доступен
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: url
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url)
        alert('Ссылка скопирована в буфер обмена!')
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url)
      alert('Ссылка скопирована в буфер обмена!')
    }
  }

  const handleDownload = () => {
    // Создаем ссылку для скачивания
    const link = document.createElement('a')
    link.href = video.videoUrl
    link.download = `${video.title}.mp4`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDeleteVideo = () => {
    if (!user || video.userId !== user.id) return
    
    if (confirm('Удалить это видео? Это действие нельзя отменить.')) {
      const success = dataManager.deleteVideo(video.id, user.id)
      if (success) {
        router.push('/')
      }
    }
  }

  const canDelete = isAuthenticated && user && video.userId === user.id

  const userLiked = isAuthenticated && user ? isLiked(user.id) : false
  const userDisliked = isAuthenticated && user ? isDisliked(user.id) : false

  return (
    <div className="mt-4 space-y-4">
      {/* Video Title */}
      <h1 className="text-xl font-semibold text-white leading-tight">
        {video.title}
      </h1>

      {/* Video Stats and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-gray-400 text-sm">
          {formatViews(video.viewCount)} просмотров • {formatUploadDate(video.uploadDate)}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Like/Dislike */}
          <div className="flex items-center bg-surface rounded-full">
            <button
              onClick={handleLike}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-2 px-4 py-2 rounded-l-full transition-all ${
                userLiked 
                  ? 'text-white bg-accent hover:bg-orange-600' 
                  : 'text-white hover:bg-gray-700'
              } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ThumbsUp className={`w-5 h-5 ${userLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{formatViews(video.likeCount)}</span>
            </button>
            
            <div className="w-px h-6 bg-gray-600"></div>
            
            <button
              onClick={handleDislike}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-2 px-4 py-2 rounded-r-full transition-all ${
                userDisliked 
                  ? 'text-white bg-red-600 hover:bg-red-700' 
                  : 'text-white hover:bg-gray-700'
              } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ThumbsDown className={`w-5 h-5 ${userDisliked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Share */}
          <button 
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 bg-surface rounded-full text-white hover:bg-gray-700 transition-colors"
          >
            <Share className="w-5 h-5" />
            <span className="text-sm">Поделиться</span>
          </button>

          {/* Download */}
          <button 
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-surface rounded-full text-white hover:bg-gray-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span className="text-sm hidden sm:inline">Скачать</span>
          </button>

          {/* Report */}
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 bg-surface rounded-full text-white hover:bg-gray-700 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-12 bg-surface border border-gray-600 rounded-lg shadow-lg z-10 min-w-[150px]">
                {canDelete && (
                  <button
                    onClick={handleDeleteVideo}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Удалить видео</span>
                  </button>
                )}
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Flag className="w-4 h-4" />
                  <span>Пожаловаться</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Channel Info */}
      <div className="flex items-start space-x-4 p-4 bg-surface rounded-lg">
        <div className="w-12 h-12 bg-gray-600 rounded-full overflow-hidden flex-shrink-0">
          {video.user.avatarUrl ? (
            <Image
              src={video.user.avatarUrl}
              alt={video.user.displayName}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-600 flex items-center justify-center">
              <span className="text-white font-medium text-lg">
                {video.user.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-medium text-white">{video.user.displayName}</h3>
            {video.user.isVerified && (
              <CheckCircle className="w-4 h-4 text-accent" />
            )}
          </div>
          
          <p className="text-gray-400 text-sm mb-3">
            {formatViews(video.user.subscriberCount)} подписчиков
          </p>
        </div>
        
        <button
          onClick={toggleSubscription}
          disabled={!isAuthenticated || user?.id === video.userId}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            !isAuthenticated || user?.id === video.userId
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : isSubscribed
                ? 'bg-gray-600 text-white hover:bg-gray-500'
                : 'bg-accent text-black hover:bg-orange-600'
          }`}
        >
          {!isAuthenticated 
            ? 'Войдите для подписки' 
            : user?.id === video.userId
              ? 'Ваш канал'
              : isSubscribed 
                ? 'Отписаться' 
                : 'Подписаться'
          }
        </button>
      </div>

      {/* Description */}
      <div className="bg-surface rounded-lg p-4">
        <div className={`text-gray-300 text-sm ${
          showFullDescription ? '' : 'line-clamp-3'
        }`}>
          {video.description || 'Описание отсутствует'}
        </div>
        
        {video.description && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-accent text-sm mt-2 hover:underline"
          >
            {showFullDescription ? 'Свернуть' : 'Показать еще'}
          </button>
        )}

        {/* Tags */}
        {video.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {video.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full hover:bg-gray-600 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}