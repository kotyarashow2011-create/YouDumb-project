'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Heart, MessageCircle, UserPlus, Upload, Radio, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { Notification } from '@/lib/notifications'
import Link from 'next/link'

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllAsRead, requestPermission } = useNotifications(user?.id)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    // Запрашиваем разрешение на уведомления при первом рендере
    requestPermission()
  }, [requestPermission])

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />
      case 'subscribe':
        return <UserPlus className="w-4 h-4 text-green-500" />
      case 'upload':
        return <Upload className="w-4 h-4 text-accent" />
      case 'live':
        return <Radio className="w-4 h-4 text-red-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-400" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'только что'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин назад`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч назад`
    return `${Math.floor(diffInSeconds / 86400)} дн назад`
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    setIsOpen(false)
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-surface border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-white font-medium">Уведомления</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-accent text-sm hover:text-orange-400 transition-colors"
                >
                  Прочитать все
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Пока нет уведомлений</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-800 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-gray-800/50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {notification.videoId ? (
                    <Link href={`/watch/${notification.videoId}`}>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            {notification.fromUser?.avatarUrl && (
                              <img
                                src={notification.fromUser.avatarUrl}
                                alt={notification.fromUser.displayName}
                                className="w-6 h-6 rounded-full"
                              />
                            )}
                            <p className="text-white text-sm font-medium truncate">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-gray-500 text-xs mt-2">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {notification.fromUser?.avatarUrl && (
                            <img
                              src={notification.fromUser.avatarUrl}
                              alt={notification.fromUser.displayName}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <p className="text-white text-sm font-medium truncate">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-700 text-center">
              <Link
                href="/notifications"
                className="text-accent text-sm hover:text-orange-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Посмотреть все уведомления
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}