'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ThumbsUp, ThumbsDown, Reply, MoreVertical, Trash2, Edit } from 'lucide-react'
import { useComments } from '@/hooks/useData'
import { useAuth } from '@/hooks/useAuth'
import { Comment } from '@/lib/data'
import { formatUploadDate } from '@/lib/utils'
import { dataManager } from '@/lib/data'

interface CommentSectionProps {
  videoId: string
}

export function CommentSection({ videoId }: CommentSectionProps) {
  const { comments, loading, addComment } = useComments(videoId)
  const { user, isAuthenticated } = useAuth()
  const [newComment, setNewComment] = useState('')
  const [sortBy, setSortBy] = useState('top')

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !isAuthenticated || !user) return

    addComment(newComment, user.id)
    setNewComment('')
  }

  if (loading) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-700 rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-gray-700 rounded w-24 animate-pulse"></div>
        </div>
        
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      {/* Comments Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          {comments.length} комментариев
        </h3>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-surface border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
        >
          <option value="top">Лучшие</option>
          <option value="newest">Новые</option>
        </select>
      </div>

      {/* Add Comment */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex space-x-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.displayName}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <span className="text-white text-sm font-medium">
                  {user?.displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Добавьте комментарий..."
                className="w-full bg-transparent border-b border-gray-600 text-white placeholder-gray-400 py-2 resize-none focus:outline-none focus:border-accent"
                rows={1}
                onFocus={(e) => {
                  e.target.rows = 3
                }}
                onBlur={(e) => {
                  if (!newComment) e.target.rows = 1
                }}
              />
              
              {newComment && (
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setNewComment('')}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Комментировать
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-surface rounded-lg text-center">
          <p className="text-gray-400 mb-4">
            Войдите в аккаунт, чтобы оставлять комментарии
          </p>
          <button
            onClick={() => window.location.href = '/auth/login'}
            className="btn-primary"
          >
            Войти
          </button>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-2">
            Пока нет комментариев
          </p>
          <p className="text-gray-500">
            Станьте первым, кто оставит комментарий!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              videoId={videoId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CommentItem({ comment, videoId, onReply }: { 
  comment: Comment
  videoId?: string
  onReply?: (parentId: string) => void 
}) {
  const [showReplies, setShowReplies] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const { user, isAuthenticated } = useAuth()

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !isAuthenticated || !user || !videoId) return

    dataManager.addComment(replyText, videoId, user.id, comment.id)
    setReplyText('')
    setShowReplyForm(false)
    setShowReplies(true)
  }

  const handleDelete = () => {
    if (!user || comment.userId !== user.id) return
    
    if (confirm('Удалить комментарий?')) {
      dataManager.deleteComment(comment.id)
      setShowMenu(false)
    }
  }

  const canDelete = isAuthenticated && user && comment.userId === user.id

  return (
    <div className="space-y-4">
      <div className="flex space-x-3">
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
          {comment.user.avatarUrl ? (
            <Image
              src={comment.user.avatarUrl}
              alt={comment.user.displayName}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <span className="text-white text-xs font-medium">
              {comment.user.displayName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-white text-sm">
              {comment.user.displayName}
            </span>
            <span className="text-gray-400 text-xs">
              {formatUploadDate(comment.createdAt)}
            </span>
          </div>
          
          <p className="text-gray-300 text-sm mb-2">
            {comment.content}
          </p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-1 text-xs transition-colors ${
                isLiked ? 'text-accent' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{comment.likeCount}</span>
            </button>
            
            <button
              onClick={() => setIsDisliked(!isDisliked)}
              className={`text-xs transition-colors ${
                isDisliked ? 'text-accent' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
            
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center space-x-1 text-gray-400 hover:text-white text-xs transition-colors"
            >
              <Reply className="w-4 h-4" />
              <span>Ответить</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-6 bg-surface border border-gray-600 rounded-lg shadow-lg z-10 min-w-[120px]">
                  {canDelete && (
                    <button
                      onClick={handleDelete}
                      className="w-full px-3 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center space-x-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Удалить</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-full px-3 py-2 text-left text-gray-400 hover:bg-gray-700 text-sm"
                  >
                    Пожаловаться
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && isAuthenticated && (
        <div className="ml-11 mt-3">
          <form onSubmit={handleReply} className="flex space-x-3">
            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.displayName}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <span className="text-white text-xs font-medium">
                  {user?.displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Добавьте ответ..."
                className="w-full bg-transparent border-b border-gray-600 text-white placeholder-gray-400 py-2 resize-none focus:outline-none focus:border-accent text-sm"
                rows={2}
              />
              
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReplyForm(false)
                    setReplyText('')
                  }}
                  className="px-3 py-1 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-3 py-1 bg-accent text-black rounded text-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ответить
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-accent text-sm hover:underline mb-3"
          >
            {showReplies ? 'Скрыть ответы' : `Показать ${comment.replies.length} ответов`}
          </button>
          
          {showReplies && (
            <div className="space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem 
                  key={reply.id} 
                  comment={reply} 
                  videoId={videoId}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}