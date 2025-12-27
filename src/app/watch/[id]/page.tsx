import { VideoPlayer } from '@/components/video/VideoPlayer'
import { VideoInfo } from '@/components/video/VideoInfo'
import { CommentSection } from '@/components/video/CommentSection'
import { RecommendedVideos } from '@/components/video/RecommendedVideos'

// Mock video data
const mockVideo = {
  id: '1',
  title: 'Как создать свой YouTube канал в 2024 году',
  description: 'В этом видео я расскажу вам пошагово, как создать успешный YouTube канал в 2024 году. Мы разберем все этапы: от создания аккаунта до монетизации контента.',
  videoUrl: '/api/placeholder/video.mp4',
  thumbnail: '/api/placeholder/1280/720',
  duration: 754, // 12:34 in seconds
  views: 125000,
  likes: 8500,
  dislikes: 120,
  uploadDate: new Date('2024-01-15'),
  channel: {
    id: 'channel-1',
    name: 'Блогер Иван',
    avatar: '/api/placeholder/80/80',
    subscribers: 45000,
    verified: true,
    description: 'Канал о создании контента и развитии в интернете'
  },
  tags: ['youtube', 'блоггинг', 'контент', 'заработок']
}

interface WatchPageProps {
  params: {
    id: string
  }
}

export default function WatchPage({ params }: WatchPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <VideoPlayer video={mockVideo} />
            
            {/* Video Info */}
            <VideoInfo video={mockVideo} />
            
            {/* Comments */}
            <CommentSection videoId={params.id} />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <RecommendedVideos currentVideoId={params.id} />
          </div>
        </div>
      </div>
    </div>
  )
}