'use client'

import { Suspense } from 'react'
import { MobileCheckout } from '@/components/mobile/mobile-checkout'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen page-gradient">
      <Suspense fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ff007a] border-t-transparent" />
        </div>
      }>
        <MobileCheckout onClose={() => router.back()} />
      </Suspense>
    </div>
  )
}
