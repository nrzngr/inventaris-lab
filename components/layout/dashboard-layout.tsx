'use client'

import { ReactNode } from 'react'
import { Sidebar } from './sidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-white w-full">
      <Sidebar />

      {/* Main Content */}
      <div className="lg:pl-64 w-full">
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}