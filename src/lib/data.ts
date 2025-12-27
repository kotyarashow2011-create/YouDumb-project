// Data management for videos, channels, etc.
import { notificationManager } from './notifications'
export interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  videoUrl: string
  duration: number
  viewCount: number
  likeCount: number
  dislikeCount: number
  uploadDate: Date
  userId: string
  user: {
    id: string
    username: string
    displayName: string
    avatarUrl?: string
    isVerified: boolean
    subscriberCount: number
  }
  tags: string[]
  status: 'processing' | 'published' | 'private'
  category: string
  isLive?: boolean
}

export interface Comment {
  id: string
  content: string
  userId: string
  user: {
    id: string
    username: string
    displayName: string
    avatarUrl?: string
    isVerified: boolean
  }
  videoId: string
  parentId?: string
  likeCount: number
  dislikeCount: number
  createdAt: Date
  replies: Comment[]
}

export interface Channel {
  id: string
  userId: string
  name: string
  description: string
  avatarUrl?: string
  bannerUrl?: string
  subscriberCount: number
  videoCount: number
  isVerified: boolean
  createdAt: Date
}

export interface Subscription {
  id: string
  subscriberId: string
  channelId: string
  createdAt: Date
}

class DataManager {
  private static instance: DataManager
  private videos: Video[] = []
  private comments: Comment[] = []
  private channels: Channel[] = []
  private subscriptions: Subscription[] = []
  private userLikes: Set<string> = new Set()
  private userDislikes: Set<string> = new Set()
  private listeners: (() => void)[] = []

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager()
    }
    return DataManager.instance
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadData()
    }
  }

  private loadData() {
    const stored = localStorage.getItem('youdumb_data')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        this.videos = parsed.videos?.map((v: any) => ({
          ...v,
          uploadDate: new Date(v.uploadDate)
        })) || []
        this.comments = parsed.comments?.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt)
        })) || []
        this.channels = parsed.channels?.map((ch: any) => ({
          ...ch,
          createdAt: new Date(ch.createdAt)
        })) || []
        this.subscriptions = parsed.subscriptions?.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt)
        })) || []
        this.userLikes = new Set(parsed.userLikes || [])
        this.userDislikes = new Set(parsed.userDislikes || [])
      } catch (e) {
        console.error('Error loading data:', e)
      }
    }
  }

  private saveData() {
    const data = {
      videos: this.videos,
      comments: this.comments,
      channels: this.channels,
      subscriptions: this.subscriptions,
      userLikes: Array.from(this.userLikes),
      userDislikes: Array.from(this.userDislikes)
    }
    localStorage.setItem('youdumb_data', JSON.stringify(data))
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener())
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Videos
  getVideos(): Video[] {
    return this.videos.filter(v => v.status === 'published').sort((a, b) => 
      b.uploadDate.getTime() - a.uploadDate.getTime()
    )
  }

  getTrendingVideos(): Video[] {
    return this.videos
      .filter(v => v.status === 'published')
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10)
  }

  getLiveStreams(): Video[] {
    return this.videos.filter(v => v.isLive && v.status === 'published')
  }

  getVideoById(id: string): Video | undefined {
    return this.videos.find(v => v.id === id)
  }

  getVideosByUserId(userId: string): Video[] {
    return this.videos.filter(v => v.userId === userId)
  }

  addVideo(video: Omit<Video, 'id' | 'viewCount' | 'likeCount' | 'dislikeCount' | 'uploadDate'>): Video {
    const newVideo: Video = {
      ...video,
      id: `video_${Date.now()}`,
      viewCount: 0,
      likeCount: 0,
      dislikeCount: 0,
      uploadDate: new Date()
    }
    this.videos.push(newVideo)
    this.saveData()
    this.notifyListeners()
    return newVideo
  }

  incrementViews(videoId: string) {
    const video = this.videos.find(v => v.id === videoId)
    if (video) {
      video.viewCount++
      this.saveData()
      this.notifyListeners()
    }
  }

  deleteVideo(videoId: string, userId: string): boolean {
    const videoIndex = this.videos.findIndex(v => v.id === videoId)
    if (videoIndex === -1) return false

    const video = this.videos[videoIndex]
    
    // Проверяем, что пользователь может удалить это видео
    if (video.userId !== userId) return false

    // Удаляем видео
    this.videos.splice(videoIndex, 1)

    // Удаляем все комментарии к этому видео
    this.comments = this.comments.filter(c => c.videoId !== videoId)

    // Удаляем лайки/дизлайки
    this.userLikes = new Set(Array.from(this.userLikes).filter(like => !like.endsWith(`_${videoId}`)))
    this.userDislikes = new Set(Array.from(this.userDislikes).filter(dislike => !dislike.endsWith(`_${videoId}`)))

    this.saveData()
    this.notifyListeners()
    return true
  }

  // Likes/Dislikes
  likeVideo(videoId: string, userId: string) {
    const video = this.videos.find(v => v.id === videoId)
    if (!video) return

    const likeKey = `${userId}_${videoId}`
    
    if (this.userLikes.has(likeKey)) {
      // Unlike
      this.userLikes.delete(likeKey)
      video.likeCount--
    } else {
      // Like
      this.userLikes.add(likeKey)
      video.likeCount++
      
      // Remove dislike if exists
      if (this.userDislikes.has(likeKey)) {
        this.userDislikes.delete(likeKey)
        video.dislikeCount--
      }

      // Отправляем уведомление владельцу видео
      if (video.userId !== userId) {
        const likerUser = {
          id: userId,
          username: `user_${userId.slice(-4)}`,
          displayName: `Пользователь ${userId.slice(-4)}`,
          avatarUrl: undefined
        }
        notificationManager.notifyLike(video.userId, likerUser, video.title, videoId)
      }
    }
    
    this.saveData()
    this.notifyListeners()
  }

  dislikeVideo(videoId: string, userId: string) {
    const video = this.videos.find(v => v.id === videoId)
    if (!video) return

    const likeKey = `${userId}_${videoId}`
    
    if (this.userDislikes.has(likeKey)) {
      // Remove dislike
      this.userDislikes.delete(likeKey)
      video.dislikeCount--
    } else {
      // Dislike
      this.userDislikes.add(likeKey)
      video.dislikeCount++
      
      // Remove like if exists
      if (this.userLikes.has(likeKey)) {
        this.userLikes.delete(likeKey)
        video.likeCount--
      }
    }
    
    this.saveData()
    this.notifyListeners()
  }

  isVideoLiked(videoId: string, userId: string): boolean {
    return this.userLikes.has(`${userId}_${videoId}`)
  }

  isVideoDisliked(videoId: string, userId: string): boolean {
    return this.userDislikes.has(`${userId}_${videoId}`)
  }

  // Comments
  getCommentsByVideoId(videoId: string): Comment[] {
    return this.comments
      .filter(c => c.videoId === videoId && !c.parentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map(comment => ({
        ...comment,
        replies: this.comments
          .filter(c => c.parentId === comment.id)
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      }))
  }

  addComment(content: string, videoId: string, userId: string, parentId?: string): Comment {
    // Get user info (in real app, fetch from user service)
    const user = {
      id: userId,
      username: `user_${userId.slice(-4)}`,
      displayName: `Пользователь ${userId.slice(-4)}`,
      isVerified: false
    }

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      content,
      userId,
      user,
      videoId,
      parentId,
      likeCount: 0,
      dislikeCount: 0,
      createdAt: new Date(),
      replies: []
    }

    this.comments.push(newComment)

    // Отправляем уведомление владельцу видео
    const video = this.videos.find(v => v.id === videoId)
    if (video && video.userId !== userId) {
      notificationManager.notifyComment(video.userId, user, video.title, videoId)
    }

    this.saveData()
    this.notifyListeners()
    return newComment
  }

  deleteComment(commentId: string) {
    // Удаляем комментарий и все его ответы
    const deleteCommentAndReplies = (id: string) => {
      // Находим все ответы на этот комментарий
      const replies = this.comments.filter(c => c.parentId === id)
      
      // Рекурсивно удаляем ответы
      replies.forEach(reply => deleteCommentAndReplies(reply.id))
      
      // Удаляем сам комментарий
      const index = this.comments.findIndex(c => c.id === id)
      if (index !== -1) {
        this.comments.splice(index, 1)
      }
    }

    deleteCommentAndReplies(commentId)
    this.saveData()
    this.notifyListeners()
  }

  // Channels
  getChannelByUserId(userId: string): Channel | undefined {
    return this.channels.find(c => c.userId === userId)
  }

  createChannel(userId: string, name: string, description: string): Channel {
    const newChannel: Channel = {
      id: `channel_${Date.now()}`,
      userId,
      name,
      description,
      subscriberCount: 0,
      videoCount: 0,
      isVerified: false,
      createdAt: new Date()
    }

    this.channels.push(newChannel)
    this.saveData()
    this.notifyListeners()
    return newChannel
  }

  // Subscriptions
  isSubscribed(subscriberId: string, channelId: string): boolean {
    return this.subscriptions.some(s => s.subscriberId === subscriberId && s.channelId === channelId)
  }

  // Подписка на пользователя (создаем канал если его нет)
  subscribeToUser(subscriberId: string, targetUserId: string) {
    if (subscriberId === targetUserId) return // Нельзя подписаться на себя

    // Находим или создаем канал для пользователя
    let channel = this.getChannelByUserId(targetUserId)
    if (!channel) {
      // Создаем канал автоматически
      const targetUser = this.videos.find(v => v.userId === targetUserId)?.user
      if (!targetUser) return

      channel = this.createChannel(targetUserId, targetUser.displayName, `Канал пользователя ${targetUser.displayName}`)
    }

    if (this.isSubscribed(subscriberId, channel.id)) return

    const subscription: Subscription = {
      id: `sub_${Date.now()}`,
      subscriberId,
      channelId: channel.id,
      createdAt: new Date()
    }

    this.subscriptions.push(subscription)
    
    // Update channel subscriber count
    channel.subscriberCount++

    // Отправляем уведомление
    const subscriberUser = {
      id: subscriberId,
      username: `user_${subscriberId.slice(-4)}`,
      displayName: `Пользователь ${subscriberId.slice(-4)}`,
      avatarUrl: undefined
    }
    notificationManager.notifySubscribe(targetUserId, subscriberUser)

    this.saveData()
    this.notifyListeners()
  }

  // Отписка от пользователя
  unsubscribeFromUser(subscriberId: string, targetUserId: string) {
    const channel = this.getChannelByUserId(targetUserId)
    if (!channel) return

    const index = this.subscriptions.findIndex(s => s.subscriberId === subscriberId && s.channelId === channel.id)
    if (index === -1) return

    this.subscriptions.splice(index, 1)
    
    // Update channel subscriber count
    if (channel.subscriberCount > 0) {
      channel.subscriberCount--
    }

    this.saveData()
    this.notifyListeners()
  }

  // Проверка подписки на пользователя
  isSubscribedToUser(subscriberId: string, targetUserId: string): boolean {
    const channel = this.getChannelByUserId(targetUserId)
    if (!channel) return false
    return this.isSubscribed(subscriberId, channel.id)
  }

  subscribeToChannel(subscriberId: string, channelId: string) {
    if (this.isSubscribed(subscriberId, channelId)) return

    const subscription: Subscription = {
      id: `sub_${Date.now()}`,
      subscriberId,
      channelId,
      createdAt: new Date()
    }

    this.subscriptions.push(subscription)
    
    // Update channel subscriber count
    const channel = this.channels.find(c => c.id === channelId)
    if (channel) {
      channel.subscriberCount++
    }

    this.saveData()
    this.notifyListeners()
  }

  unsubscribeFromChannel(subscriberId: string, channelId: string) {
    const index = this.subscriptions.findIndex(s => s.subscriberId === subscriberId && s.channelId === channelId)
    if (index === -1) return

    this.subscriptions.splice(index, 1)
    
    // Update channel subscriber count
    const channel = this.channels.find(c => c.id === channelId)
    if (channel) {
      channel.subscriberCount--
    }

    this.saveData()
    this.notifyListeners()
  }

  getSubscribedChannels(userId: string): Channel[] {
    const userSubs = this.subscriptions.filter(s => s.subscriberId === userId)
    return userSubs.map(sub => this.channels.find(c => c.id === sub.channelId)).filter(Boolean) as Channel[]
  }

  // Search
  searchVideos(query: string): Video[] {
    const lowerQuery = query.toLowerCase()
    return this.videos
      .filter(v => v.status === 'published')
      .filter(v => 
        v.title.toLowerCase().includes(lowerQuery) ||
        v.description.toLowerCase().includes(lowerQuery) ||
        v.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        v.user.displayName.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => b.viewCount - a.viewCount)
  }
}

export const dataManager = DataManager.getInstance()