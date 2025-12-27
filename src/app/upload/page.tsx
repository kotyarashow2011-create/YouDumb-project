import { VideoUploadForm } from '@/components/upload/VideoUploadForm'

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Загрузить видео
          </h1>
          <p className="text-gray-400">
            Поделитесь своим контентом с аудиторией YouDumb
          </p>
        </div>

        <VideoUploadForm />
      </div>
    </div>
  )
}