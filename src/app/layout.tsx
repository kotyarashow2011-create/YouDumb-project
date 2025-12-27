import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'YouDumb - Российская видеоплатформа',
  description: 'Смотрите и загружайте видео на YouDumb - лучшей российской видеоплатформе',
  keywords: 'видео, российская платформа, загрузка видео, стриминг',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-64">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}