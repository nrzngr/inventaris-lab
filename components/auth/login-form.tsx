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

export function useAuth() {
  return useCustomAuth()
}

export function LoginForm() {
  const { login, loading, user } = useAuth()
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Lab Inventory</h1>
          <p className="text-gray-600 font-medium">Sistem Manajemen Peralatan Laboratorium</p>
        </div>

        <ModernCard variant="elevated" padding="lg" className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <ModernInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="nama@email.com"
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <ModernInput
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Masukkan password"
                  className="pl-10 pr-10"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <ModernButton
              type="submit"
              variant="default"
              size="lg"
              loading={isSubmitting}
              disabled={isSubmitting || !formData.email || !formData.password}
              className="w-full"
            >
              {isSubmitting ? 'Masuk...' : 'Masuk'}
            </ModernButton>

            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Lupa Password?
              </Link>
            </div>
          </form>
        </ModernCard>

        <ModernCard variant="default" padding="lg">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">Akun Demo</h3>
              <p className="text-sm text-gray-600">Gunakan akun berikut untuk testing:</p>
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs text-yellow-800">
                  💡 Mode Development - Login dengan demo account langsung tersedia
                </p>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Latest credentials from database
                {demoAccounts.filter(acc => acc.isDatabase).length > 0 &&
                  ` (${demoAccounts.filter(acc => acc.isDatabase).length} from database)`
                }
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
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                    onClick={() => {
                      setFormData({
                        email: account.email,
                        password: account.password
                      })
                      setError('')
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <ModernBadge variant="default" size="sm">
                          {account.role}
                        </ModernBadge>
                        {account.isDatabase && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            DB
                          </span>
                        )}
                        <span className="font-mono text-sm">{account.email}</span>
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-600 opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-xs text-gray-600">
                      Password: <span className="font-mono">{account.password}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {account.description}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="text-center text-xs text-gray-500 pt-2 border-t">
              Klik pada akun demo untuk mengisi form secara otomatis
            </div>
          </div>
        </ModernCard>

        <div className="text-center text-sm text-gray-600">
          <p>Belum punya akun? Hubungi administrator laboratorium</p>
        </div>
      </div>
    </div>
  )
}