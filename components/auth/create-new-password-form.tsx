'use client'

import { useState } from 'react'
import { useCustomAuth } from '@/components/auth/custom-auth-provider'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export function CreateNewPasswordForm() {
  const { resetPassword } = useCustomAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Validate passwords match
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('Passwords do not match')
      setIsSubmitting(false)
      return
    }

    try {
      const result = await resetPassword(token, formData.newPassword)
      if (result.success) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        setError(result.error || 'Failed to reset password')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) {
      setError('')
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex bg-white">
        {/* Left Column - Success Message */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md text-center">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">Labbo</span>
            </div>

            {/* Success Message */}
            <div className="mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Reset Successfully!</h1>
              <p className="text-lg text-gray-600">Your password has been updated. Redirecting to login...</p>
            </div>

            {/* Auto-redirect countdown */}
            <div className="mt-8">
              <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
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

              {/* Geometric Shapes */}
              <circle cx="80" cy="150" r="40" fill="white" opacity="0.1"/>
              <rect x="300" y="100" width="60" height="60" fill="white" opacity="0.1" transform="rotate(45 330 130)"/>
              <polygon points="200,450 250,500 150,500" fill="white" opacity="0.1"/>

              {/* Additional decorative elements */}
              <circle cx="320" cy="400" r="25" fill="white" opacity="0.08"/>
              <rect x="50" y="500" width="40" height="40" fill="white" opacity="0.08" transform="rotate(30 70 520)"/>
            </svg>
          </div>
        </div>
      </div>
    )
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create a new password</h1>
            <p className="text-lg text-gray-600">Choose a secure password and confirm it below.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="New Password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent pr-12"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm New Password Input */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                placeholder="Confirm New Password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent pr-12"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isSubmitting}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Create New Password Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.newPassword || !formData.confirmNewPassword}
              className="w-full bg-pink-500 text-white py-3 rounded-lg font-medium hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create New Password'}
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

            {/* Geometric Shapes */}
            <circle cx="80" cy="150" r="40" fill="white" opacity="0.1"/>
            <rect x="300" y="100" width="60" height="60" fill="white" opacity="0.1" transform="rotate(45 330 130)"/>
            <polygon points="200,450 250,500 150,500" fill="white" opacity="0.1"/>

            {/* Additional decorative elements */}
            <circle cx="320" cy="400" r="25" fill="white" opacity="0.08"/>
            <rect x="50" y="500" width="40" height="40" fill="white" opacity="0.08" transform="rotate(30 70 520)"/>
            <ellipse cx="250" cy="300" rx="35" ry="20" fill="white" opacity="0.06"/>
          </svg>
        </div>
      </div>
    </div>
  )
}