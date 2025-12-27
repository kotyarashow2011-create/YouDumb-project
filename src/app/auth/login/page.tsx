import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-2xl">YD</span>
            </div>
            <span className="text-3xl font-bold text-white">
              You<span className="text-accent">Dumb</span>
            </span>
          </Link>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            Войти в аккаунт
          </h2>
          <p className="text-gray-400">
            Добро пожаловать обратно на YouDumb
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Register Link */}
        <div className="text-center">
          <p className="text-gray-400">
            Нет аккаунта?{' '}
            <Link href="/auth/register" className="text-accent hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}