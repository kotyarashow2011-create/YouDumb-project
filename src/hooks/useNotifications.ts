'use client'

import { useState, useEffect } from 'react'
import { notificationManager, Notification } from '@/lib/notifications'

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    const updateNotifications = () => {
      const userNotifications = notificationManager.getNotifications(userId)
      const unread = notificationManager.getUnreadCount(userId)
      
      setNotifications(userNotifications)
      setUnreadCount(unread)
      setLoading(false)
    }

    updateNotifications()
    const unsubscribe = notificationManager.subscribe(updateNotifications)
    return unsubscribe
  }, [userId])

  const markAsRead = (notificationId: string) => {
    notificationManager.markAsRead(notificationId)
  }

  const markAllAsRead = () => {
    if (userId) {
      notificationManager.markAllAsRead(userId)
    }
  }

  const requestPermission = async () => {
    return await notificationManager.requestPermission()
  }

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    requestPermission
  }
}