'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ModernCard, ModernCardHeader } from '@/components/ui/modern-card'
import { ModernButton } from '@/components/ui/modern-button'
import { Calendar, Clock } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

function SchedulingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const equipmentId = searchParams?.get('equipment')

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 page-gradient min-h-screen">
        <ModernCard variant="elevated" padding="lg" className="mb-6 sm:mb-8 fade-in">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-600 rounded-xl">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 mb-1 sm:mb-2">
                  Penjadwalan Peralatan
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-medium">
                  Fitur penjadwalan sedang dalam pengembangan
                </p>
              </div>
            </div>
          </div>
        </ModernCard>

        <ModernCard variant="default" padding="lg">
          <div className="text-center py-12">
            <div className="p-4 sm:p-6 bg-blue-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Fitur Dalam Pengembangan
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Sistem penjadwalan dan reservasi peralatan sedang dikembangkan.
              Fitur ini akan tersedia segera.
            </p>
            {equipmentId && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-4">
                  Peralatan yang dipilih: {equipmentId}
                </p>
              </div>
            )}
            <ModernButton
              onClick={() => router.push('/dashboard/equipment')}
              variant="outline"
              size="sm"
            >
              Kembali ke Peralatan
            </ModernButton>
          </div>
        </ModernCard>
      </div>
    </DashboardLayout>
  )
}

export default function SchedulingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchedulingContent />
    </Suspense>
  )
}