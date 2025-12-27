'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ThumbsUp, ThumbsDown, Share, Download, Flag, CheckCircle } from 'lucide-react'
import { formatViews, formatUploadDate } from '@/lib/utils'

interface VideoInfoProps {
  video: {
    id: string
    title: string
    description: string
    views: number
    likes: number
    dislikes: number
    uploadDate: Date
    channel: {
      id: string
      name: string
      avatar: string
      subscribers: number
      verified: boolean
      description: string
    }
    tags: string[]
  }
}

export function VideoInfo({ video }: VideoInfoProps) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (isDisliked) setIsDisliked(false)
  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    if (isLiked) setIsLiked(false)
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Video Title */}
      <h1 className="text-xl font-semibold text-white leading-tight">
        {video.title}
      </h1>

      {/* Video Stats and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-gray-400 text-sm">
          {formatViews(video.views)} просмотров • {formatUploadDate(video.uploadDate)}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Like/Dislike */}
          <div className="flex items-center bg-surface rounded-full">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-l-full transition-colors ${
                isLiked ? 'text-accent' : 'text-white hover:bg-gray-700'
              }`}
            >
              <ThumbsUp className="w-5 h-5" />
              <span className="text-sm">{formatViews(video.likes)}</span>
            </button>
            
            <div className="w-px h-6 bg-gray-600"></div>
            
            <button
              onClick={handleDislike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-r-full transition-colors ${
                isDisliked ? 'text-accent' : 'text-white hover:bg-gray-700'
              }`}
            >
              <ThumbsDown className="w-5 h-5" />
            </button>
          </div>

          {/* Share */}
          <button className="flex items-center space-x-2 px-4 py-2 bg-surface rounded-full text-white hover:bg-gray-700 transition-colors">
            <Share className="w-5 h-5" />
            <span className="text-sm">Поделиться</span>
          </button>

          {/* Download */}
          <button className="flex items-center space-x-2 px-4 py-2 bg-surface rounded-full text-white hover:bg-gray-700 transition-colors">
            <Download className="w-5 h-5" />
            <span className="text-sm hidden sm:inline">Скачать</span>
          </button>

          {/* Report */}
          <button className="p-2 bg-surface rounded-full text-white hover:bg-gray-700 transition-colors">
            <Flag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Channel Info */}
      <div className="flex items-start space-x-4 p-4 bg-surface rounded-lg">
        <Image
          src={video.channel.avatar}
          alt={video.channel.name}
          width={48}
          height={48}
          className="rounded-full"
        />
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-medium text-white">{video.channel.name}</h3>
            {video.channel.verified && (
              <CheckCircle className="w-4 h-4 text-accent" />
            )}
          </div>
          
          <p className="text-gray-400 text-sm mb-3">
            {formatViews(video.channel.subscribers)} подписчиков
          </p>
          
          <p className="text-gray-300 text-sm">
            {video.channel.description}
          </p>
        </div>
        
        <button
          onClick={() => setIsSubscribed(!isSubscribed)}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            isSubscribed
              ? 'bg-gray-600 text-white hover:bg-gray-700'
              : 'bg-accent text-black hover:bg-orange-600'
          }`}
        >
          {isSubscribed ? 'Отписаться' : 'Подписаться'}
        </button>
      </div>

      {/* Description */}
      <div className="bg-surface rounded-lg p-4">
        <div className={`text-gray-300 text-sm ${
          showFullDescription ? '' : 'line-clamp-3'
        }`}>
          {video.description}
        </div>
        
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="text-accent text-sm mt-2 hover:underline"
        >
          {showFullDescription ? 'Свернуть' : 'Показать еще'}
        </button>

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