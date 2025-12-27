'use client'

import { useState, useEffect } from 'react'
import { authManager, AuthState } from '@/lib/auth'
import { dataManager } from '@/lib/data'

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => authManager.getAuthState())

  useEffect(() => {
    const unsubscribe = authManager.subscribe((newState) => {
      setAuthState(newState)
      // Уведомляем dataManager о смене пользователя
      dataManager.switchUser(newState.user?.id)
    })
    
    // Инициализируем dataManager с текущим пользователем при первой загрузке
    dataManager.switchUser(authState.user?.id)
    
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    return await authManager.login(email, password)
  }

  const register = async (username: string, email: string, password: string) => {
    return await authManager.register(username, email, password)
  }

  const logout = () => {
    authManager.logout()
  }

  return {
    ...authState,
    login,
    register,
    logout
  }
}