// Simple authentication state management
export interface User {
  id: string
  username: string
  email: string
  displayName: string
  avatarUrl?: string
  subscriberCount: number
  createdAt: Date
  isVerified: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Simple localStorage-based auth (in production, use proper JWT/sessions)
class AuthManager {
  private static instance: AuthManager
  private authState: AuthState = {
    user: null,
    isAuthenticated: false
  }
  private listeners: ((state: AuthState) => void)[] = []

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadAuthState()
    }
  }

  private loadAuthState() {
    const stored = localStorage.getItem('youdumb_auth')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        this.authState = {
          user: {
            ...parsed.user,
            createdAt: new Date(parsed.user.createdAt)
          },
          isAuthenticated: true
        }
      } catch (e) {
        localStorage.removeItem('youdumb_auth')
      }
    }
  }

  private saveAuthState() {
    if (this.authState.user) {
      localStorage.setItem('youdumb_auth', JSON.stringify(this.authState))
    } else {
      localStorage.removeItem('youdumb_auth')
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.authState))
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  getAuthState(): AuthState {
    return this.authState
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simple validation (in production, validate against backend)
    if (email && password.length >= 6) {
      const user: User = {
        id: `user_${Date.now()}`,
        username: email.split('@')[0],
        email,
        displayName: email.split('@')[0],
        subscriberCount: 0,
        createdAt: new Date(),
        isVerified: false
      }

      this.authState = {
        user,
        isAuthenticated: true
      }

      this.saveAuthState()
      this.notifyListeners()
      return { success: true }
    }

    return { success: false, error: 'Неверный email или пароль' }
  }

  async register(username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (username.length >= 3 && email && password.length >= 6) {
      const user: User = {
        id: `user_${Date.now()}`,
        username,
        email,
        displayName: username,
        subscriberCount: 0,
        createdAt: new Date(),
        isVerified: false
      }

      this.authState = {
        user,
        isAuthenticated: true
      }

      this.saveAuthState()
      this.notifyListeners()
      return { success: true }
    }

    return { success: false, error: 'Проверьте введенные данные' }
  }

  logout() {
    this.authState = {
      user: null,
      isAuthenticated: false
    }
    this.saveAuthState()
    this.notifyListeners()
  }
}

export const authManager = AuthManager.getInstance()