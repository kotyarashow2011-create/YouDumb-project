'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, LogIn, UserPlus, Settings, LogOut, Upload } from 'lucide-react'

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This will be connected to auth later

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-surface rounded-full transition-colors"
      >
        <User className="w-6 h-6 text-white" />
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
            {isLoggedIn ? (
              // Logged in menu
              <div className="py-2">
                <div className="px-4 py-3 border-b border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Пользователь</p>
                      <p className="text-gray-400 text-sm">user@example.com</p>
                    </div>
                  </div>
                </div>
                
                <Link
                  href="/channel"
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
                    onClick={() => {
                      setIsLoggedIn(false)
                      setIsOpen(false)
                    }}
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