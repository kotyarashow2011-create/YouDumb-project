'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Play, MoreVertical, CheckCircle, Radio } from 'lucide-react'
import { useState } from 'react'
import { formatViews, formatUploadDate, formatDuration } from '@/lib/utils'
import { Video } from '@/lib/data'

interface VideoCardProps {
  video: Video
}

export function VideoCard({ video }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div 
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/watch/${video.id}`}>
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden mb-3">
          {!imageError ? (
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <Play className="w-12 h-12 text-gray-500" />
            </div>
          )}
          
          {/* Live indicator */}
          {video.isLive && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
              <Radio className="w-3 h-3" />
              <span>LIVE</span>
            </div>
          )}
          
          {/* Duration */}
          {!video.isLive && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
              {formatDuration(video.duration)}
            </div>
          )}
          
          {/* Hover Play Button */}
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-black ml-1" />
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Video Info */}
      <div className="flex space-x-3">
        {/* Channel Avatar */}
        <Link href={`/channel/${video.user.id}`}>
          <div className="w-9 h-9 bg-gray-600 rounded-full overflow-hidden flex-shrink-0">
            {video.user.avatarUrl && !imageError ? (
              <Image
                src={video.user.avatarUrl}
                alt={video.user.displayName}
                width={36}
                height={36}
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {video.user.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Video Details */}
        <div className="flex-1 min-w-0">
          <Link href={`/watch/${video.id}`}>
            <h3 className="text-white font-medium text-sm line-clamp-2 mb-1 group-hover:text-accent transition-colors">
              {video.title}
            </h3>
          </Link>
          
          <Link href={`/channel/${video.user.id}`}>
            <div className="flex items-center space-x-1 mb-1">
              <span className="text-gray-400 text-xs hover:text-white transition-colors">
                {video.user.displayName}
              </span>
              {video.user.isVerified && (
                <CheckCircle className="w-3 h-3 text-accent" />
              )}
            </div>
          </Link>
          
          <div className="text-gray-400 text-xs">
            {formatViews(video.viewCount)} просмотров • {formatUploadDate(video.uploadDate)}
          </div>
        </div>

        {/* More Options */}
        <button className="p-1 hover:bg-surface rounded-full transition-colors opacity-0 group-hover:opacity-100">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  )
}