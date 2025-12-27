import { RegisterForm } from '@/components/auth/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
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
            Создать аккаунт
          </h2>
          <p className="text-gray-400">
            Присоединяйтесь к сообществу YouDumb
          </p>
        </div>

        {/* Register Form */}
        <RegisterForm />

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-400">
            Уже есть аккаунт?{' '}
            <Link href="/auth/login" className="text-accent hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}