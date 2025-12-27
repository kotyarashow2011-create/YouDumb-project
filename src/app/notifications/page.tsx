'use client'

import { Bell, Heart, MessageCircle, UserPlus, Upload, Radio, Check, CheckCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { Notification } from '@/lib/notifications'
import Link from 'next/link'

export default function NotificationsPage() {
  const { user, isAuthenticated } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user?.id)

  if (!isAuthenticated) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Bell className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Войдите, чтобы видеть уведомления
          </h1>
          <p className="text-gray-400 mb-6">
            Получайте уведомления о новых видео, комментариях и лайках
          </p>
          <div className="space-x-4">
            <Link href="/auth/login" className="btn-primary">
              Войти
            </Link>
            <Link href="/auth/register" className="btn-secondary">
              Регистрация
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />
      case 'subscribe':
        return <UserPlus className="w-5 h-5 text-green-500" />
      case 'upload':
        return <Upload className="w-5 h-5 text-accent" />
      case 'live':
        return <Radio className="w-5 h-5 text-red-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-400" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'только что'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин назад`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч назад`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} дн назад`
    return date.toLocaleDateString('ru-RU')
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Уведомления</h1>
            <p className="text-gray-400">
              {unreadCount > 0 ? `${unreadCount} непрочитанных` : 'Все уведомления прочитаны'}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn-secondary flex items-center space-x-2"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Прочитать все</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-surface rounded-lg p-12 text-center">
              <Bell className="w-16 h-16 text-gray-600 mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Пока нет уведомлений
              </h2>
              <p className="text-gray-400 mb-6">
                Когда появятся новые видео, комментарии или лайки, вы увидите их здесь
              </p>
              <Link href="/" className="btn-primary">
                Перейти на главную
              </Link>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-surface rounded-lg p-6 border-l-4 transition-all hover:bg-gray-800 ${
                  !notification.read 
                    ? 'border-accent bg-gray-800/50' 
                    : 'border-transparent'
                }`}
              >
                {notification.videoId ? (
                  <Link 
                    href={`/watch/${notification.videoId}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500 text-sm">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-accent rounded-full" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-300 mb-3">
                          {notification.message}
                        </p>
                        
                        {notification.fromUser && (
                          <div className="flex items-center space-x-2">
                            {notification.fromUser.avatarUrl ? (
                              <img
                                src={notification.fromUser.avatarUrl}
                                alt={notification.fromUser.displayName}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white">
                                  {notification.fromUser.displayName.charAt(0)}
                                </span>
                              </div>
                            )}
                            <span className="text-gray-400 text-sm">
                              {notification.fromUser.displayName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div 
                    className="flex items-start space-x-4 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 text-sm">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-accent rounded-full" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-3">
                        {notification.message}
                      </p>
                      
                      {notification.fromUser && (
                        <div className="flex items-center space-x-2">
                          {notification.fromUser.avatarUrl ? (
                            <img
                              src={notification.fromUser.avatarUrl}
                              alt={notification.fromUser.displayName}
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white">
                                {notification.fromUser.displayName.charAt(0)}
                              </span>
                            </div>
                          )}
                          <span className="text-gray-400 text-sm">
                            {notification.fromUser.displayName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Settings Link */}
        {notifications.length > 0 && (
          <div className="mt-8 text-center">
            <Link 
              href="/settings?tab=notifications" 
              className="text-accent hover:text-orange-400 transition-colors"
            >
              Настроить уведомления
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}