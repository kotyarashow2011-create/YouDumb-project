'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ThumbsUp, ThumbsDown, Reply, MoreVertical } from 'lucide-react'

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
    verified: boolean
  }
  content: string
  likes: number
  dislikes: number
  timestamp: string
  replies?: Comment[]
}

const mockComments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'Анна Петрова',
      avatar: '/api/placeholder/32/32',
      verified: false
    },
    content: 'Отличное видео! Очень полезная информация, спасибо за подробный разбор.',
    likes: 24,
    dislikes: 1,
    timestamp: '2 часа назад',
    replies: [
      {
        id: '1-1',
        author: {
          name: 'Блогер Иван',
          avatar: '/api/placeholder/32/32',
          verified: true
        },
        content: 'Спасибо за отзыв! Рад, что видео оказалось полезным.',
        likes: 8,
        dislikes: 0,
        timestamp: '1 час назад'
      }
    ]
  },
  {
    id: '2',
    author: {
      name: 'Михаил Сидоров',
      avatar: '/api/placeholder/32/32',
      verified: false
    },
    content: 'Можете сделать видео про монетизацию канала? Очень интересная тема.',
    likes: 15,
    dislikes: 0,
    timestamp: '4 часа назад'
  },
  {
    id: '3',
    author: {
      name: 'Елена Козлова',
      avatar: '/api/placeholder/32/32',
      verified: false
    },
    content: 'Начала делать свой канал по вашим советам. Уже есть первые результаты!',
    likes: 31,
    dislikes: 2,
    timestamp: '1 день назад'
  }
]

interface CommentSectionProps {
  videoId: string
}

export function CommentSection({ videoId }: CommentSectionProps) {
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState('')
  const [sortBy, setSortBy] = useState('top')

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: 'Вы',
        avatar: '/api/placeholder/32/32',
        verified: false
      },
      content: newComment,
      likes: 0,
      dislikes: 0,
      timestamp: 'только что'
    }

    setComments([comment, ...comments])
    setNewComment('')
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
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex space-x-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">Вы</span>
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

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}

function CommentItem({ comment }: { comment: Comment }) {
  const [showReplies, setShowReplies] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex space-x-3">
        <Image
          src={comment.author.avatar}
          alt={comment.author.name}
          width={32}
          height={32}
          className="rounded-full"
        />
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-white text-sm">
              {comment.author.name}
            </span>
            <span className="text-gray-400 text-xs">
              {comment.timestamp}
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
              <span>{comment.likes}</span>
            </button>
            
            <button
              onClick={() => setIsDisliked(!isDisliked)}
              className={`text-xs transition-colors ${
                isDisliked ? 'text-accent' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
            
            <button className="flex items-center space-x-1 text-gray-400 hover:text-white text-xs transition-colors">
              <Reply className="w-4 h-4" />
              <span>Ответить</span>
            </button>
            
            <button className="text-gray-400 hover:text-white transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

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
                <CommentItem key={reply.id} comment={reply} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}