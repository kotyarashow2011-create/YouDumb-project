'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, LogIn, UserPlus, Settings, LogOut, Upload } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-surface rounded-full transition-colors"
      >
        {isAuthenticated && user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.displayName}
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <User className="w-6 h-6 text-white" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-surface border border-gray-600 rounded-lg shadow-lg z-50">
            {isAuthenticated && user ? (
              // Logged in menu
              <div className="py-2">
                <div className="px-4 py-3 border-b border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.displayName}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <span className="text-black font-medium">
                          {user.displayName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.displayName}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                </div>
                
                <Link
                  href={`/channel/${user.id}`}
                  className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Мой канал</span>
                </Link>
                
                <Link
                  href="/upload"
                  className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Upload className="w-5 h-5" />
                  <span>Загрузить видео</span>
                </Link>
                
                <Link
                  href="/settings"
                  className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span>Настройки</span>
                </Link>
                
                <div className="border-t border-gray-600 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-gray-700 transition-colors w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Выйти</span>
                  </button>
                </div>
              </div>
            ) : (
              // Not logged in menu
              <div className="py-2">
                <div className="px-4 py-3 border-b border-gray-600">
                  <p className="text-white font-medium">Войдите в аккаунт</p>
                  <p className="text-gray-400 text-sm">
                    Чтобы загружать видео и оставлять комментарии
                  </p>
                </div>
                
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Войти</span>
                </Link>
                
                <Link
                  href="/auth/register"
                  className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Регистрация</span>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}