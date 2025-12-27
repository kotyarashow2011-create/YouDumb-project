'use client'

import { HelpCircle, Search, Upload, Users, Shield, MessageCircle } from 'lucide-react'
import { useState } from 'react'

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'Все', icon: HelpCircle },
    { id: 'upload', label: 'Загрузка', icon: Upload },
    { id: 'account', label: 'Аккаунт', icon: Users },
    { id: 'privacy', label: 'Приватность', icon: Shield },
    { id: 'community', label: 'Сообщество', icon: MessageCircle },
  ]

  const faqItems = [
    {
      category: 'upload',
      question: 'Как загрузить видео на YouDumb?',
      answer: 'Нажмите кнопку "Загрузить" в верхней части страницы, выберите видеофайл и заполните информацию о видео. Поддерживаются форматы MP4, WebM, AVI, MOV размером до 2GB.'
    },
    {
      category: 'upload',
      question: 'Какие форматы видео поддерживаются?',
      answer: 'YouDumb поддерживает следующие форматы: MP4, WebM, AVI, MOV. Рекомендуется использовать MP4 для лучшей совместимости.'
    },
    {
      category: 'upload',
      question: 'Как создать прямую трансляцию?',
      answer: 'На странице загрузки выберите "Стрим" вместо "Видео", заполните информацию о трансляции и нажмите "Начать трансляцию".'
    },
    {
      category: 'account',
      question: 'Как создать аккаунт?',
      answer: 'Нажмите "Регистрация" в правом верхнем углу, заполните форму с именем пользователя, email и паролем. После регистрации вы сможете загружать видео и оставлять комментарии.'
    },
    {
      category: 'account',
      question: 'Как изменить настройки профиля?',
      answer: 'Перейдите в "Настройки" через меню пользователя. Там вы можете изменить имя, аватар, описание и другие параметры профиля.'
    },
    {
      category: 'privacy',
      question: 'Как сделать видео приватным?',
      answer: 'При загрузке видео выберите "Приватное" в настройках видимости. Приватные видео видны только вам.'
    },
    {
      category: 'privacy',
      question: 'Можно ли удалить историю просмотров?',
      answer: 'Да, в настройках приватности вы можете отключить сохранение истории просмотров или очистить существующую историю.'
    },
    {
      category: 'community',
      question: 'Как оставить комментарий?',
      answer: 'Под любым видео есть поле для комментариев. Войдите в аккаунт, напишите комментарий и нажмите "Комментировать".'
    },
    {
      category: 'community',
      question: 'Как подписаться на канал?',
      answer: 'На странице видео или канала нажмите кнопку "Подписаться". Вы будете получать уведомления о новых видео от этого автора.'
    },
  ]

  const filteredFAQ = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 text-accent mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Центр помощи YouDumb
          </h1>
          <p className="text-gray-400 text-lg">
            Найдите ответы на часто задаваемые вопросы
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по вопросам..."
              className="w-full pl-12 pr-4 py-3 bg-surface border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  activeCategory === category.id
                    ? 'bg-accent text-black'
                    : 'bg-surface text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.label}</span>
              </button>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Ничего не найдено
              </h3>
              <p className="text-gray-400">
                Попробуйте изменить поисковый запрос или выбрать другую категорию
              </p>
            </div>
          ) : (
            filteredFAQ.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))
          )}
        </div>

        {/* Contact */}
        <div className="mt-12 bg-surface rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">
            Не нашли ответ на свой вопрос?
          </h3>
          <p className="text-gray-400 mb-6">
            Свяжитесь с нашей службой поддержки, и мы поможем вам
          </p>
          <div className="space-x-4">
            <button className="btn-primary">
              Связаться с поддержкой
            </button>
            <button className="btn-secondary">
              Сообщить об ошибке
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-surface rounded-lg border border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
      >
        <span className="font-medium text-white">{question}</span>
        <HelpCircle className={`w-5 h-5 text-accent transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-300 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}