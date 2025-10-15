'use client'

import { useState } from 'react'
import { useCustomAuth } from '@/components/auth/custom-auth-provider'
import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface ForgotPasswordFormProps {
  onBack?: () => void
  onSuccess?: (email: string) => void
}

export function ForgotPasswordForm({ onBack, onSuccess }: ForgotPasswordFormProps) {
  const { requestPasswordReset } = useCustomAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await requestPasswordReset(email)

      if (!result.success) {
        setError(result.error || 'Failed to reset password')
        return
      }

      // Redirect to link sent page with email parameter
      router.push(`/link-sent?email=${encodeURIComponent(email)}`)

    } catch (error) {
      setError('An error occurred while resetting password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">Labbo</span>
          </div>

          {/* Headline */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Forgot your Password?</h1>
            <p className="text-lg text-gray-600">Don't worry just enter your email below and we'll send you a link to reset it.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-pink-500 text-white py-3 rounded-lg font-medium hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Reset Password'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <span className="text-gray-600">Remember your password? </span>
            <Link
              href="/"
              className="text-pink-500 hover:text-pink-600 font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column - Decorative Panel */}
      <div className="hidden lg:flex lg:flex-1 bg-pink-500 items-center justify-center p-8">
        <div className="relative w-full h-full max-w-2xl max-h-[600px]">
          {/* Abstract Decorative Shapes */}
          <svg className="w-full h-full" viewBox="0 0 400 600" fill="none">
            {/* Curved Lines */}
            <path d="M50 300 Q100 200 150 250 T250 200" stroke="white" strokeWidth="3" opacity="0.3"/>
            <path d="M100 400 Q200 350 250 400 T350 350" stroke="white" strokeWidth="2" opacity="0.2"/>
            <path d="M80 180 Q150 120 200 160 T300 140" stroke="white" strokeWidth="2.5" opacity="0.25"/>
            <path d="M120 500 Q180 450 220 480 T280 460" stroke="white" strokeWidth="2" opacity="0.2"/>

            {/* Geometric Shapes */}
            <circle cx="80" cy="150" r="40" fill="white" opacity="0.1"/>
            <rect x="300" y="100" width="60" height="60" fill="white" opacity="0.1" transform="rotate(45 330 130)"/>
            <polygon points="200,450 250,500 150,500" fill="white" opacity="0.1"/>
            <ellipse cx="250" cy="300" rx="35" ry="20" fill="white" opacity="0.06"/>

            {/* Additional decorative elements */}
            <circle cx="320" cy="400" r="25" fill="white" opacity="0.08"/>
            <rect x="50" y="500" width="40" height="40" fill="white" opacity="0.08" transform="rotate(30 70 520)"/>
            <polygon points="150,250 180,200 120,200" fill="white" opacity="0.05"/>
          </svg>
        </div>
      </div>
    </div>
  )
}