'use client'

import { useState, useEffect } from 'react'
import { dataManager } from '@/lib/data'

export function useSubscription(subscriberId?: string, targetUserId?: string) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!subscriberId || !targetUserId) {
      setIsSubscribed(false)
      setLoading(false)
      return
    }

    const updateSubscription = () => {
      const subscribed = dataManager.isSubscribedToUser(subscriberId, targetUserId)
      setIsSubscribed(subscribed)
      setLoading(false)
    }

    updateSubscription()
    const unsubscribe = dataManager.subscribe(updateSubscription)
    return unsubscribe
  }, [subscriberId, targetUserId])

  const toggleSubscription = () => {
    if (!subscriberId || !targetUserId) return

    if (isSubscribed) {
      dataManager.unsubscribeFromUser(subscriberId, targetUserId)
    } else {
      dataManager.subscribeToUser(subscriberId, targetUserId)
    }
  }

  return {
    isSubscribed,
    loading,
    toggleSubscription
  }
}