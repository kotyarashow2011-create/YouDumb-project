// Создание тестовых данных для демонстрации
import { dataManager } from './data'

export function seedTestData() {
  // Проверяем, есть ли уже данные
  if (dataManager.getVideos().length > 0) {
    return // Данные уже есть
  }

  // Создаем тестовых пользователей
  const testUsers = [
    {
      id: 'user_demo1',
      username: 'techblogger',
      displayName: 'Технический Блогер',
      avatarUrl: 'https://picsum.photos/100/100?random=1',
      isVerified: true,
      subscriberCount: 15420
    },
    {
      id: 'user_demo2', 
      username: 'gamingpro',
      displayName: 'Gaming Pro',
      avatarUrl: 'https://picsum.photos/100/100?random=2',
      isVerified: false,
      subscriberCount: 8930
    },
    {
      id: 'user_demo3',
      username: 'musiclover',
      displayName: 'Музыкальный Канал',
      avatarUrl: 'https://picsum.photos/100/100?random=3',
      isVerified: true,
      subscriberCount: 25600
    },
    {
      id: 'user_demo4',
      username: 'cookingtips',
      displayName: 'Кулинарные Советы',
      avatarUrl: 'https://picsum.photos/100/100?random=4',
      isVerified: false,
      subscriberCount: 12100
    }
  ]

  // Реальные тестовые видео
  const testVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
  ]

  // Создаем тестовые видео
  const videos = [
    {
      title: 'Обзор новых технологий 2024',
      description: 'Подробный обзор самых интересных технологических новинок этого года. Рассматриваем ИИ, квантовые компьютеры и многое другое!',
      user: testUsers[0],
      tags: ['технологии', 'обзор', '2024', 'ИИ'],
      category: 'technology',
      isLive: false,
      duration: 1245
    },
    {
      title: 'ПРЯМОЙ ЭФИР: Играем в новую игру!',
      description: 'Стримим новую игру вместе с подписчиками. Заходите в чат!',
      user: testUsers[1],
      tags: ['игры', 'стрим', 'прямойэфир'],
      category: 'gaming',
      isLive: true,
      duration: 0
    },
    {
      title: 'Топ 10 треков недели',
      description: 'Лучшие музыкальные новинки этой недели. Слушаем и обсуждаем!',
      user: testUsers[2],
      tags: ['музыка', 'топ', 'новинки'],
      category: 'music',
      isLive: false,
      duration: 892
    },
    {
      title: 'Готовим идеальную пасту за 15 минут',
      description: 'Простой рецепт вкусной пасты, которую можно приготовить очень быстро. Все ингредиенты доступны в любом магазине.',
      user: testUsers[3],
      tags: ['кулинария', 'рецепт', 'паста', 'быстро'],
      category: 'cooking',
      isLive: false,
      duration: 678
    },
    {
      title: 'Как настроить домашнюю сеть',
      description: 'Пошаговое руководство по настройке Wi-Fi роутера и домашней сети. Для начинающих и продвинутых пользователей.',
      user: testUsers[0],
      tags: ['технологии', 'сеть', 'wifi', 'настройка'],
      category: 'technology',
      isLive: false,
      duration: 1567
    },
    {
      title: 'Летсплей: Прохождение RPG',
      description: 'Продолжаем проходить эпическую RPG. Сегодня исследуем новые локации и сражаемся с боссами!',
      user: testUsers[1],
      tags: ['игры', 'rpg', 'летсплей'],
      category: 'gaming',
      isLive: false,
      duration: 2134
    }
  ]

  // Добавляем видео в систему
  videos.forEach((videoData, index) => {
    const videoUrl = testVideos[index % testVideos.length]
    const thumbnailUrl = `https://picsum.photos/320/180?random=${index + 10}`
    
    const video = dataManager.addVideo({
      title: videoData.title,
      description: videoData.description,
      thumbnailUrl,
      videoUrl,
      duration: videoData.duration,
      userId: videoData.user.id,
      user: videoData.user,
      tags: videoData.tags,
      status: 'published',
      category: videoData.category,
      isLive: videoData.isLive
    })

    // Добавляем случайные просмотры и лайки
    const views = Math.floor(Math.random() * 50000) + 1000
    const likes = Math.floor(views * 0.05) + Math.floor(Math.random() * 100)
    const dislikes = Math.floor(likes * 0.1) + Math.floor(Math.random() * 10)
    
    video.viewCount = views
    video.likeCount = likes
    video.dislikeCount = dislikes
  })

  // Добавляем тестовые комментарии
  const comments = [
    'Отличное видео! Очень полезно 👍',
    'Спасибо за обзор, ждем еще!',
    'Можете сделать видео про...?',
    'Лайк за качественный контент!',
    'Интересно, но хотелось бы больше деталей',
    'Подписался, продолжайте в том же духе!',
    'Очень познавательно, спасибо!',
    'Когда будет следующее видео?'
  ]

  dataManager.getVideos().forEach(video => {
    const commentCount = Math.floor(Math.random() * 5) + 1
    for (let i = 0; i < commentCount; i++) {
      const randomUser = testUsers[Math.floor(Math.random() * testUsers.length)]
      const randomComment = comments[Math.floor(Math.random() * comments.length)]
      
      dataManager.addComment(randomComment, video.id, randomUser.id)
    }
  })

  console.log('Тестовые данные созданы!')
}