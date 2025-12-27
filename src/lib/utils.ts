import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}М`
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(0)}К`
  }
  return views.toString()
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function formatUploadDate(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'только что'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${getMinutesWord(minutes)} назад`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${getHoursWord(hours)} назад`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${getDaysWord(days)} назад`
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} ${getMonthsWord(months)} назад`
  } else {
    const years = Math.floor(diffInSeconds / 31536000)
    return `${years} ${getYearsWord(years)} назад`
  }
}

function getMinutesWord(count: number): string {
  if (count === 1) return 'минуту'
  if (count >= 2 && count <= 4) return 'минуты'
  return 'минут'
}

function getHoursWord(count: number): string {
  if (count === 1) return 'час'
  if (count >= 2 && count <= 4) return 'часа'
  return 'часов'
}

function getDaysWord(count: number): string {
  if (count === 1) return 'день'
  if (count >= 2 && count <= 4) return 'дня'
  return 'дней'
}

function getMonthsWord(count: number): string {
  if (count === 1) return 'месяц'
  if (count >= 2 && count <= 4) return 'месяца'
  return 'месяцев'
}

function getYearsWord(count: number): string {
  if (count === 1) return 'год'
  if (count >= 2 && count <= 4) return 'года'
  return 'лет'
}