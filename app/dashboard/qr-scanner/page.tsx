'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QRScanner } from '@/components/mobile/qr-scanner'
import { ModernCard } from '@/components/ui/modern-card'
import { ModernButton } from '@/components/ui/modern-button'
import { ModernBadge } from '@/components/ui/modern-badge'
import { Camera, Search, ArrowLeft, Info } from 'lucide-react'

export default function QRScannerPage() {
  const router = useRouter()
  const [scanResult, setScanResult] = useState<any>(null)
  const [equipmentDetails, setEquipmentDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleScanSuccess = async (qrData: any) => {
    setScanResult(qrData)
    await fetchEquipmentDetails(qrData.id)
  }

  const handleScanError = (error: string) => {
    console.error('QR scan error:', error)
  }

  const fetchEquipmentDetails = async (equipmentId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/equipment/${equipmentId}`)

      if (response.ok) {
        const data = await response.json()
        setEquipmentDetails(data.equipment)
      } else {
        console.error('Failed to fetch equipment details')
      }
    } catch (error) {
      console.error('Error fetching equipment details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBorrowEquipment = () => {
    if (equipmentDetails) {
      router.push(`/dashboard/transactions/borrow?equipment=${equipmentDetails.id}`)
    }
  }

  const handleReserveEquipment = () => {
    if (equipmentDetails) {
      router.push(`/dashboard/scheduling?equipment=${equipmentDetails.id}`)
    }
  }

  const handleViewDetails = () => {
    if (equipmentDetails) {
      router.push(`/dashboard/equipment/${equipmentDetails.id}`)
    }
  }

  const resetScanner = () => {
    setScanResult(null)
    setEquipmentDetails(null)
  }

  return (
    <div className="min-h-screen page-gradient">
      {/* Header */}
      <div className="border-b border-[#f1d6e6]/70 bg-white/85 backdrop-blur-xl shadow-[0_12px_28px_rgba(17,24,39,0.08)]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-4">
            <ModernButton
              onClick={() => router.back()}
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </ModernButton>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-[#111827]">QR Scanner</h1>
              <p className="text-sm font-medium text-[#6d7079]">
                Scan equipment QR codes for quick access
              </p>
            </div>
          </div>

          <ModernButton
            onClick={() => router.push('/dashboard/equipment')}
            variant="outline"
            size="sm"
            leftIcon={<Search className="w-4 h-4" />}
          >
            Search Manual
          </ModernButton>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-8 lg:py-10">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* QR Scanner */}
          {!scanResult && (
            <QRScanner
              onScanSuccess={handleScanSuccess}
              onScanError={handleScanError}
            />
          )}

          {/* Equipment Details */}
          {scanResult && (
            <div className="space-y-4">
              {/* Scan Success Card */}
              <ModernCard variant="default" padding="lg">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-[14px] bg-[#dcfce7] p-2">
                    <Camera className="h-6 w-6 text-[#15803d]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#111827]">QR Code Scanned</h2>
                    <p className="text-sm font-medium text-[#6d7079]">
                      Equipment identified successfully
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center gap-3 rounded-[18px] bg-[#f3f4fb] py-6">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ff007a] border-t-transparent" />
                    <span className="text-sm font-medium text-[#6d7079]">
                      Loading equipment details...
                    </span>
                  </div>
                ) : equipmentDetails ? (
                  <div className="space-y-4">
                    {/* Equipment Info */}
                    <div className="rounded-[18px] bg-[#f3f4fb] p-5">
                      <h3 className="mb-3 text-base font-semibold text-[#111827]">Equipment Information</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-[#9aa1b3]">
                            Name
                          </p>
                          <p className="text-sm font-semibold text-[#111827]">
                            {equipmentDetails.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-[#9aa1b3]">
                            Serial Number
                          </p>
                          <p className="text-sm font-semibold text-[#111827]">
                            {equipmentDetails.serial_number}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-[#9aa1b3]">
                            Category
                          </p>
                          <p className="text-sm font-semibold text-[#111827]">
                            {equipmentDetails.category_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-[#9aa1b3]">
                            Location
                          </p>
                          <p className="text-sm font-semibold text-[#111827]">
                            {equipmentDetails.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-[#9aa1b3]">
                            Status
                          </p>
                          <ModernBadge
                            variant={
                              equipmentDetails.status === 'available'
                                ? 'success'
                                : equipmentDetails.status === 'borrowed'
                                ? 'destructive'
                                : 'warning'
                            }
                            size="sm"
                            className="capitalize"
                          >
                            {equipmentDetails.status}
                          </ModernBadge>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-[#9aa1b3]">
                            Condition
                          </p>
                          <p className="text-sm font-semibold capitalize text-[#111827]">
                            {equipmentDetails.condition}
                          </p>
                        </div>
                      </div>

                      {equipmentDetails.description && (
                        <div className="mt-4 rounded-[18px] bg-white/80 p-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-[#9aa1b3]">
                            Description
                          </p>
                          <p className="mt-2 text-sm font-medium text-[#444d5b]">
                            {equipmentDetails.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3">
                      <h4 className="text-base font-semibold text-[#111827]">Quick Actions</h4>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <ModernButton
                          onClick={handleBorrowEquipment}
                          variant="default"
                          disabled={equipmentDetails.status !== 'available'}
                          className="w-full"
                        >
                          Borrow Now
                        </ModernButton>
                        <ModernButton
                          onClick={handleReserveEquipment}
                          variant="outline"
                          className="w-full"
                        >
                          Reserve
                        </ModernButton>
                        <ModernButton
                          onClick={handleViewDetails}
                          variant="outline"
                          className="w-full"
                        >
                          View Details
                        </ModernButton>
                      </div>
                    </div>

                    {equipmentDetails.status !== 'available' && (
                      <div className="flex items-center gap-3 rounded-[18px] bg-[#fff6e6] px-4 py-3">
                        <Info className="h-4 w-4 text-[#b45309]" />
                        <span className="text-sm font-medium text-[#b45309]">
                          This equipment is currently {equipmentDetails.status}.
                          {equipmentDetails.status === 'borrowed' && ' You can reserve it for future use.'}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-[18px] bg-white/70 py-8 text-center backdrop-blur">
                    <p className="text-sm font-medium text-[#6d7079]">Equipment details not found</p>
                    <ModernButton
                      onClick={resetScanner}
                      variant="outline"
                      size="sm"
                      className="mt-3"
                    >
                      Scan Another QR Code
                    </ModernButton>
                  </div>
                )}

                {/* Reset Button */}
                {!isLoading && (
                  <div className="border-t border-[#f1d6e6]/70 pt-4">
                    <ModernButton
                      onClick={resetScanner}
                      variant="outline"
                      className="w-full"
                    >
                      Scan Another QR Code
                    </ModernButton>
                  </div>
                )}
              </ModernCard>
            </div>
          )}

          {/* Instructions */}
          {!scanResult && (
            <ModernCard variant="outline" padding="lg" className="bg-white/80 backdrop-blur-sm">
              <h3 className="mb-3 text-base font-semibold text-[#111827]">How to Use QR Scanner</h3>
              <div className="space-y-2 text-sm font-medium text-[#6d7079]">
                <p>1. Position your device camera over the equipment QR code</p>
                <p>2. Ensure good lighting and steady hands for best results</p>
                <p>3. The scanner will automatically detect and read the QR code</p>
                <p>4. Once scanned, you'll see equipment details and available actions</p>
              </div>
            </ModernCard>
          )}
        </div>
      </div>
    </div>
  )
}
