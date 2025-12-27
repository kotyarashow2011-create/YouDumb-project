// Система уведомлений
export interface Notification {
  id: string
  type: 'like' | 'comment' | 'subscribe' | 'upload' | 'live'
  title: string
  message: string
  userId: string
  fromUser?: {
    id: string
    username: string
    displayName: string
    avatarUrl?: string
  }
  videoId?: string
  createdAt: Date
  read: boolean
}

class NotificationManager {
  private static instance: NotificationManager
  private notifications: Notification[] = []
  private listeners: ((notifications: Notification[]) => void)[] = []

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager()
    }
    return NotificationManager.instance
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadNotifications()
    }
  }

  private loadNotifications() {
    const stored = localStorage.getItem('youdumb_global_notifications')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        this.notifications = parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt)
        }))
      } catch (e) {
        console.error('Error loading notifications:', e)
      }
    }
  }

  private saveNotifications() {
    localStorage.setItem('youdumb_global_notifications', JSON.stringify(this.notifications))
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications))
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date(),
      read: false
    }

    this.notifications.unshift(newNotification)
    this.saveNotifications()
    this.notifyListeners()

    // Показать браузерное уведомление если разрешено
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      })
    }

    return newNotification
  }

  getNotifications(userId: string): Notification[] {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  getUnreadCount(userId: string): number {
    return this.notifications.filter(n => n.userId === userId && !n.read).length
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.saveNotifications()
      this.notifyListeners()
    }
  }

  markAllAsRead(userId: string) {
    this.notifications
      .filter(n => n.userId === userId && !n.read)
      .forEach(n => n.read = true)
    
    this.saveNotifications()
    this.notifyListeners()
  }

  // Методы для создания специфичных уведомлений
  notifyLike(videoOwnerId: string, likerUser: any, videoTitle: string, videoId: string) {
    if (videoOwnerId === likerUser.id) return // Не уведомляем себя

    this.addNotification({
      type: 'like',
      title: 'Новый лайк!',
      message: `${likerUser.displayName} лайкнул ваше видео "${videoTitle}"`,
      userId: videoOwnerId,
      fromUser: likerUser,
      videoId
    })
  }

  notifyComment(videoOwnerId: string, commenterUser: any, videoTitle: string, videoId: string) {
    if (videoOwnerId === commenterUser.id) return // Не уведомляем себя

    this.addNotification({
      type: 'comment',
      title: 'Новый комментарий!',
      message: `${commenterUser.displayName} прокомментировал ваше видео "${videoTitle}"`,
      userId: videoOwnerId,
      fromUser: commenterUser,
      videoId
    })
  }

  notifySubscribe(channelOwnerId: string, subscriberUser: any) {
    if (channelOwnerId === subscriberUser.id) return // Не уведомляем себя
    
    this.addNotification({
      type: 'subscribe',
      title: 'Новый подписчик!',
      message: `${subscriberUser.displayName} подписался на ваш канал`,
      userId: channelOwnerId,
      fromUser: subscriberUser
    })
  }

  notifyVideoUpload(subscriberIds: string[], uploaderUser: any, videoTitle: string, videoId: string) {
    subscriberIds.forEach(subscriberId => {
      if (subscriberId === uploaderUser.id) return // Не уведомляем себя
      
      this.addNotification({
        type: 'upload',
        title: 'Новое видео!',
        message: `${uploaderUser.displayName} загрузил новое видео: "${videoTitle}"`,
        userId: subscriberId,
        fromUser: uploaderUser,
        videoId
      })
    })
  }

  notifyLiveStream(subscriberIds: string[], streamerUser: any, streamTitle: string, videoId: string) {
    subscriberIds.forEach(subscriberId => {
      if (subscriberId === streamerUser.id) return // Не уведомляем себя
      
      this.addNotification({
        type: 'live',
        title: 'Прямой эфир!',
        message: `${streamerUser.displayName} начал трансляцию: "${streamTitle}"`,
        userId: subscriberId,
        fromUser: streamerUser,
        videoId
      })
    })
  }

  // Запросить разрешение на уведомления
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }
}

export const notificationManager = NotificationManager.getInstance()