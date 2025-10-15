'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export function LinkSendForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const handleResendLink = async () => {
    setIsResending(true)
    setResendMessage('')

    try {
      // Simulate API call to resend link
      await new Promise(resolve => setTimeout(resolve, 1500))
      setResendMessage('Link has been resent to your email!')
    } catch (error) {
      setResendMessage('Failed to resend link. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Column - Content */}
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

          {/* Status Indicator */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Reset link sent!</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Please check your inbox and follow the instructions to create a new password.
            </p>

            {email && (
              <p className="text-sm text-gray-500 mt-2">
                We've sent the link to: <span className="font-medium text-gray-700">{email}</span>
              </p>
            )}
          </div>

          {/* Resend Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <span>Didn't receive the email?</span>
              <button
                onClick={handleResendLink}
                disabled={isResending}
                className="text-pink-500 hover:text-pink-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? 'Sending...' : 'Resend link'}
              </button>
            </div>

            {resendMessage && (
              <div className={`p-3 rounded-lg text-sm ${
                resendMessage.includes('failed')
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {resendMessage}
              </div>
            )}

            {/* Additional Help Text */}
            <div className="text-sm text-gray-500 space-y-1">
              <p>• Check your spam folder</p>
              <p>• Make sure the email address is correct</p>
              <p>• Wait a few minutes for delivery</p>
            </div>
          </div>

          {/* Back to Sign In */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Sign In
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

            {/* Diagonal Line */}
            <path d="M300 50 L100 500" stroke="white" strokeWidth="2" opacity="0.15"/>

            {/* Curved Top Edge */}
            <path d="M50 100 Q200 50 350 100" stroke="white" strokeWidth="4" opacity="0.2"/>

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