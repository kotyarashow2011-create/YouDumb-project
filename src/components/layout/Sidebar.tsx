'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  TrendingUp, 
  Users, 
  Clock, 
  ThumbsUp, 
  History,
  PlaySquare,
  Settings,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mainNavItems = [
  { href: '/', label: 'Главная', icon: Home },
  { href: '/trending', label: 'В тренде', icon: TrendingUp },
  { href: '/subscriptions', label: 'Подписки', icon: Users },
]

const libraryItems = [
  { href: '/library', label: 'Библиотека', icon: PlaySquare },
  { href: '/history', label: 'История', icon: History },
  { href: '/watch-later', label: 'Посмотреть позже', icon: Clock },
  { href: '/liked', label: 'Понравившиеся', icon: ThumbsUp },
]

const bottomItems = [
  { href: '/settings', label: 'Настройки', icon: Settings },
  { href: '/help', label: 'Справка', icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background border-r border-gray-800 overflow-y-auto hidden lg:block">
      <nav className="p-4 space-y-6">
        {/* Main Navigation */}
        <div>
          <ul className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'bg-accent text-black font-medium'
                        : 'text-white hover:bg-surface'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700"></div>

        {/* Library Section */}
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-3 px-3">
            БИБЛИОТЕКА
          </h3>
          <ul className="space-y-1">
            {libraryItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'bg-accent text-black font-medium'
                        : 'text-white hover:bg-surface'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700"></div>

        {/* Subscriptions Section */}
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-3 px-3">
            ПОДПИСКИ
          </h3>
          <div className="px-3 py-2 text-gray-400 text-sm">
            Войдите в аккаунт, чтобы увидеть подписки
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-4 border-t border-gray-700">
          <ul className="space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'bg-accent text-black font-medium'
                        : 'text-white hover:bg-surface'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-700">
          <p className="text-gray-500 text-xs px-3">
            © 2024 YouDumb Platform
          </p>
        </div>
      </nav>
    </aside>
  )
}