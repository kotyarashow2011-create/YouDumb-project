'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Upload, User, Menu } from 'lucide-react'
import { SearchBar } from '@/components/search/SearchBar'
import { UserMenu } from '@/components/auth/UserMenu'
import { NotificationDropdown } from '@/components/layout/NotificationDropdown'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-background border-b border-gray-800 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo and Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-surface rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">YD</span>
            </div>
            <span className="text-2xl font-bold text-white hidden sm:block">
              You<span className="text-accent">Dumb</span>
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4">
          <SearchBar />
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Upload Button */}
          <Link
            href="/upload"
            className="btn-primary flex items-center space-x-2 hidden sm:flex"
          >
            <Upload className="w-5 h-5" />
            <span>Загрузить</span>
          </Link>

          {/* Mobile Upload */}
          <Link
            href="/upload"
            className="p-2 hover:bg-surface rounded-lg transition-colors sm:hidden"
          >
            <Upload className="w-6 h-6 text-white" />
          </Link>

          {/* Notifications */}
          <NotificationDropdown />

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-surface border-t border-gray-800">
          <nav className="px-4 py-2 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 text-white hover:bg-gray-700 rounded-lg"
            >
              Главная
            </Link>
            <Link
              href="/trending"
              className="block px-3 py-2 text-white hover:bg-gray-700 rounded-lg"
            >
              В тренде
            </Link>
            <Link
              href="/subscriptions"
              className="block px-3 py-2 text-white hover:bg-gray-700 rounded-lg"
            >
              Подписки
            </Link>
            <Link
              href="/library"
              className="block px-3 py-2 text-white hover:bg-gray-700 rounded-lg"
            >
              Библиотека
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}