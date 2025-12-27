'use client'

import { useState, useEffect } from 'react'
import { dataManager, Video, Comment } from '@/lib/data'

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateVideos = () => {
      setVideos(dataManager.getVideos())
      setLoading(false)
    }

    updateVideos()
    const unsubscribe = dataManager.subscribe(updateVideos)
    return unsubscribe
  }, [])

  return { videos, loading }
}

export function useTrendingVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateVideos = () => {
      setVideos(dataManager.getTrendingVideos())
      setLoading(false)
    }

    updateVideos()
    const unsubscribe = dataManager.subscribe(updateVideos)
    return unsubscribe
  }, [])

  return { videos, loading }
}

export function useLiveStreams() {
  const [streams, setStreams] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateStreams = () => {
      setStreams(dataManager.getLiveStreams())
      setLoading(false)
    }

    updateStreams()
    const unsubscribe = dataManager.subscribe(updateStreams)
    return unsubscribe
  }, [])

  return { streams, loading }
}

export function useVideo(videoId: string) {
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateVideo = () => {
      const foundVideo = dataManager.getVideoById(videoId)
      setVideo(foundVideo || null)
      setLoading(false)
    }

    updateVideo()
    const unsubscribe = dataManager.subscribe(updateVideo)
    return unsubscribe
  }, [videoId])

  const incrementViews = (userId?: string) => {
    dataManager.incrementViews(videoId, userId)
  }

  const likeVideo = (userId: string) => {
    dataManager.likeVideo(videoId, userId)
  }

  const dislikeVideo = (userId: string) => {
    dataManager.dislikeVideo(videoId, userId)
  }

  const isLiked = (userId: string) => {
    return dataManager.isVideoLiked(videoId, userId)
  }

  const isDisliked = (userId: string) => {
    return dataManager.isVideoDisliked(videoId, userId)
  }

  return {
    video,
    loading,
    incrementViews,
    likeVideo,
    dislikeVideo,
    isLiked,
    isDisliked
  }
}

export function useComments(videoId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateComments = () => {
      setComments(dataManager.getCommentsByVideoId(videoId))
      setLoading(false)
    }

    updateComments()
    const unsubscribe = dataManager.subscribe(updateComments)
    return unsubscribe
  }, [videoId])

  const addComment = (content: string, userId: string, parentId?: string) => {
    return dataManager.addComment(content, videoId, userId, parentId)
  }

  return {
    comments,
    loading,
    addComment
  }
}

export function useSearch(query: string) {
  const [results, setResults] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    const searchResults = dataManager.searchVideos(query)
    setResults(searchResults)
    setLoading(false)
  }, [query])

  return { results, loading }
}