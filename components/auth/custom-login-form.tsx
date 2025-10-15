'use client'

import { useState, useEffect } from 'react'
import { useCustomAuth } from './custom-auth-provider'
import { useRouter } from 'next/navigation'
import { ModernCard } from '@/components/ui/modern-card'
import { ModernButton } from '@/components/ui/modern-button'
import { ModernInput } from '@/components/ui/modern-input'
import { ModernBadge } from '@/components/ui/modern-badge'
import { Eye, EyeOff, Mail, Lock, AlertTriangle, CheckCircle, Users, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export function CustomLoginForm() {
  const { login, loading, user } = useCustomAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [demoAccounts, setDemoAccounts] = useState<any[]>([])
  const [isLoadingDemo, setIsLoadingDemo] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        setTimeout(() => {
          if (user?.role === 'student') {
            router.push('/dashboard/student')
          } else {
            router.push('/dashboard')
          }
        }, 500)
      } else {
        setError(result.error || 'Login gagal')
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
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

  const getTempPassword = (email: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`tempPassword_${email}`)
    }
    return null
  }

  // Fetch demo accounts from API
  const fetchDemoAccounts = async () => {
    setIsLoadingDemo(true)
    try {
      const response = await fetch('/api/demo-accounts')
      if (response.ok) {
        const data = await response.json()
        setDemoAccounts(data.demoAccounts || [])
      } else {
        console.error('Failed to fetch demo accounts')
        // Fallback to default demo accounts
        setDemoAccounts(getDefaultDemoAccounts())
      }
    } catch (error) {
      console.error('Error fetching demo accounts:', error)
      // Fallback to default demo accounts
      setDemoAccounts(getDefaultDemoAccounts())
    } finally {
      setIsLoadingDemo(false)
    }
  }

  const getDefaultDemoAccounts = () => [
    {
      email: 'admin@example.com',
      password: getTempPassword('admin@example.com') || 'admin123',
      role: 'Admin',
      description: 'Akses penuh sistem',
      full_name: 'Demo Admin',
      isDatabase: false
    },
    {
      email: 'student@example.com',
      password: getTempPassword('student@example.com') || 'student123',
      role: 'Student',
      description: 'Mahasiswa biasa',
      full_name: 'Demo Student',
      isDatabase: false
    },
    {
      email: 'lecturer@example.com',
      password: getTempPassword('lecturer@example.com') || 'lecturer123',
      role: 'Lecturer',
      description: 'Dosen pengajar',
      full_name: 'Demo Lecturer',
      isDatabase: false
    },
    {
      email: 'labstaff@example.com',
      password: getTempPassword('labstaff@example.com') || 'labstaff123',
      role: 'Lab Staff',
      description: 'Staff laboratorium',
      full_name: 'Demo Lab Staff',
      isDatabase: false
    }
  ]

  // Fetch demo accounts on component mount
  useEffect(() => {
    fetchDemoAccounts()
  }, [])

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Back to work, genius!</h1>
            <p className="text-lg text-gray-600">Let's make some science happen</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.email || !formData.password}
              className="w-full bg-pink-500 text-white py-3 rounded-lg font-medium hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              href="/register"
              className="text-pink-500 hover:text-pink-600 font-medium transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Demo Accounts - Dynamic from Supabase */}
          <details className="mt-8">
            <summary className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              <Users className="w-4 h-4" />
              Demo Accounts (Testing)
              <span className="text-xs text-gray-400">
                {demoAccounts.filter(acc => acc.isDatabase).length > 0 &&
                  `(${demoAccounts.filter(acc => acc.isDatabase).length} from database)`
                }
              </span>
            </summary>
            <div className="mt-4">
              {/* Refresh Button */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500">
                  Latest credentials from database
                </span>
                <button
                  onClick={fetchDemoAccounts}
                  disabled={isLoadingDemo}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingDemo ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {/* Demo Accounts List */}
              <div className="space-y-2">
                {isLoadingDemo ? (
                  <div className="flex items-center justify-center py-4">
                    <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="ml-2 text-xs text-gray-500">Loading demo accounts...</span>
                  </div>
                ) : (
                  demoAccounts.map((account, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer text-sm group"
                      onClick={() => {
                        setFormData({
                          email: account.email,
                          password: account.password
                        })
                        setError('')
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">{account.role}</span>
                          {account.isDatabase && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                              DB
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {account.full_name}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-xs text-gray-600 truncate">
                          {account.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {account.description}
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Password: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">{account.password}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Info */}
              <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-0.5"></div>
                  <div className="text-xs text-blue-700">
                    <p className="font-medium mb-1">Demo Account Info:</p>
                    <ul className="space-y-0.5 text-xs">
                      <li>• Click any account to auto-fill credentials</li>
                      <li>• Accounts with <span className="bg-green-100 text-green-700 px-1 py-0.5 rounded">DB</span> are from database</li>
                      <li>• Refresh to get latest database credentials</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </details>
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