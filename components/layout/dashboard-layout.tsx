'use client'

import { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { DueDateReminder } from '../notifications/due-date-reminder'
import { NotificationProvider } from '../notifications/notification-system'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-white">
        <Sidebar />

        {/* Main Content */}
        <div className="lg:pl-64">
          <main className="flex-1">
            {children}
          </main>
        </div>

        {/* Due Date Reminders for Students */}
        <DueDateReminder />
      </div>
    </NotificationProvider>
  )
}