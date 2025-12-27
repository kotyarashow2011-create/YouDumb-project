'use client'

import Link from 'next/link'
import { Upload, Video, Users } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function EmptyState() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-[600px] flex items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        {/* Icon */}
        <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
          <Video className="w-12 h-12 text-accent" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Добро пожаловать на YouDumb!
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          Пока что здесь нет видео. Станьте первым создателем контента на нашей платформе!
          Загружайте видео, создавайте каналы и стройте сообщество.
        </p>

        {/* Actions */}
        <div className="space-y-4">
          {isAuthenticated ? (
            <div className="space-y-4">
              <Link
                href="/upload"
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-3"
              >
                <Upload className="w-6 h-6" />
                <span>Загрузить первое видео</span>
              </Link>
              
              <div className="text-gray-500 text-sm">
                Поддерживаемые форматы: MP4, WebM, AVI, MOV
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/register"
                  className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-3"
                >
                  <Users className="w-6 h-6" />
                  <span>Создать аккаунт</span>
                </Link>
                
                <Link
                  href="/auth/login"
                  className="btn-secondary inline-flex items-center space-x-2 text-lg px-8 py-3"
                >
                  <span>Войти</span>
                </Link>
              </div>
              
              <div className="text-gray-500 text-sm">
                Зарегистрируйтесь, чтобы загружать видео и создавать контент
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-white font-medium mb-2">Загружайте видео</h3>
            <p className="text-gray-400 text-sm">
              Простая загрузка с поддержкой всех популярных форматов
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-white font-medium mb-2">Создавайте сообщество</h3>
            <p className="text-gray-400 text-sm">
              Подписчики, комментарии и взаимодействие с аудиторией
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Video className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-white font-medium mb-2">Прямые трансляции</h3>
            <p className="text-gray-400 text-sm">
              Стримьте в реальном времени и общайтесь с зрителями
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}