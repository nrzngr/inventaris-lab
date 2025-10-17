'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

import { LoginAccent } from './login-accent'
import { useCustomAuth } from './custom-auth-provider'

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        const target = user?.role === 'student' ? '/dashboard/student' : '/dashboard'
        setTimeout(() => router.push(target), 400)
      } else {
        setError(result.error || 'Login gagal')
      }
    } catch (submitError) {
      console.error(submitError)
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData(previous => ({
      ...previous,
      [name]: value
    }))

    if (error) {
      setError('')
    }
  }

  const isBusy = isSubmitting || loading

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f7f6fb] text-[#111827] lg:flex-row">
      <div className="flex flex-1 flex-col px-8 py-12 sm:px-16 lg:px-20 xl:px-28">
        <Link href="/" className="flex w-fit items-center" aria-label="Labbo home">
          <Image
            src="/logo.svg"
            alt="Labbo"
            width={160}
            height={48}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <div className="mt-16 flex flex-1 flex-col sm:mt-24">
          <div className="max-w-[420px]">
            <h1 className="text-[38px] font-semibold leading-tight text-[#111827] sm:text-[44px]">
              Back to work, genius!
            </h1>
            <p className="mt-4 text-[17px] text-[#6d7079]">
              Let&apos;s make some science happen
            </p>

            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  autoComplete="email"
                  required
                  className="w-full rounded-[16px] border border-[#dfe2ec] bg-[#eef0f8] px-5 py-4 text-[15px] text-[#1f2937] shadow-sm outline-none transition focus:border-[#ff007a] focus:ring-4 focus:ring-[rgba(255,0,122,0.16)] placeholder:text-[#9aa1b3]"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-[16px] border border-[#dfe2ec] bg-[#eef0f8] px-5 py-4 text-[15px] text-[#1f2937] shadow-sm outline-none transition focus:border-[#ff007a] focus:ring-4 focus:ring-[rgba(255,0,122,0.16)] placeholder:text-[#9aa1b3]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(previous => !previous)}
                  className="absolute inset-y-0 right-4 flex items-center text-[#8b8f99] transition hover:text-[#ff007a]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="flex justify-end text-[#6d7079]">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium transition hover:text-[#ff007a]"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isBusy}
                  className="inline-flex items-center justify-center rounded-[14px] bg-[#ff007a] px-12 py-3 text-base font-semibold text-white shadow-[0_25px_45px_rgba(255,0,122,0.35)] transition hover:bg-[#e6006f] focus:outline-none focus:ring-2 focus:ring-[#ff007a] focus:ring-offset-2 focus:ring-offset-[#f7f6fb] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isBusy ? 'Signing In...' : 'Sign In'}
                </button>
              </div>

              {error && (
                <p className="text-sm text-[#f04438]" role="alert">
                  {error}
                </p>
              )}
            </form>
          </div>

          <div className="mt-20 text-sm text-[#6c6f78]">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-[#ff007a] transition hover:text-[#e6006f]"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      <div className="relative hidden items-center justify-center bg-[#f7f6fb] lg:flex lg:w-[48%] xl:w-[52%]">
        <div className="relative w-full max-w-[700px] rounded-[72px] bg-[#ff007a] shadow-[0_45px_110px_rgba(255,0,122,0.35)] aspect-[442/550] overflow-hidden">
          <LoginAccent className="absolute inset-0 scale-[1.04]" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
