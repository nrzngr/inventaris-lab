'use client'

import { useState, useEffect } from 'react'
import { useCustomAuth } from '@/components/auth/custom-auth-provider'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Bell, X, Clock, AlertTriangle, Calendar } from 'lucide-react'
import { ModernCard } from '@/components/ui/modern-card'
import { ModernBadge } from '@/components/ui/modern-badge'
import { ModernButton } from '@/components/ui/modern-button'

interface DueDateReminder {
  id: string
  equipment_name: string
  due_date: string
  days_until_due: number
  is_overdue: boolean
}

export function DueDateReminder() {
  const { user } = useCustomAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [dismissedReminders, setDismissedReminders] = useState<Set<string>>(new Set())

  const { data: dueDateReminders } = useQuery({
    queryKey: ['due-date-reminders', user?.id],
    queryFn: async () => {
      if (!user) return []

      const today = new Date()
      const threeDaysFromNow = new Date()
      threeDaysFromNow.setDate(today.getDate() + 3)

      const { data, error } = await supabase
        .from('borrowing_transactions')
        .select(`
          *,
          equipment:equipment(name)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .lte('expected_return_date', threeDaysFromNow.toISOString().split('T')[0])
        .order('expected_return_date', { ascending: true })

      if (error) throw error

      return data?.map(transaction => {
        const dueDate = new Date(transaction.expected_return_date)
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        return {
          id: transaction.id,
          equipment_name: (transaction.equipment as { name?: string })?.name || 'Unknown Equipment',
          due_date: transaction.expected_return_date,
          days_until_due: daysUntilDue,
          is_overdue: daysUntilDue < 0
        } as DueDateReminder
      }) || []
    },
    enabled: !!user && user?.role === 'student',
    refetchInterval: 1000 * 60 * 30, // Refetch every 30 minutes
  })

  useEffect(() => {
    if (dueDateReminders && dueDateReminders.length > 0) {
      const hasNewReminders = dueDateReminders.some(
        reminder => !dismissedReminders.has(reminder.id)
      )
      if (hasNewReminders) {
        setIsVisible(true)
      }
    }
  }, [dueDateReminders, dismissedReminders])

  const dismissReminder = (reminderId: string) => {
    setDismissedReminders(prev => new Set([...prev, reminderId]))
  }

  const dismissAll = () => {
    if (dueDateReminders) {
      const allIds = new Set(dueDateReminders.map(r => r.id))
      setDismissedReminders(allIds)
      setIsVisible(false)
    }
  }

  const formatDueDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const getUrgencyColor = (daysUntilDue: number) => {
    if (daysUntilDue < 0) return 'border-red-600 bg-red-50'
    if (daysUntilDue === 0) return 'border-orange-600 bg-orange-50'
    if (daysUntilDue <= 2) return 'border-yellow-600 bg-yellow-50'
    return 'border-blue-600 bg-blue-50'
  }

  const getUrgencyIcon = (daysUntilDue: number) => {
    if (daysUntilDue < 0) return <AlertTriangle className="w-5 h-5 text-red-600" />
    if (daysUntilDue === 0) return <Clock className="w-5 h-5 text-orange-600" />
    return <Calendar className="w-5 h-5 text-blue-600" />
  }

  const getUrgencyText = (daysUntilDue: number) => {
    if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)} days overdue`
    if (daysUntilDue === 0) return 'Due today'
    return `Due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`
  }

  if (!user || user.role !== 'student') return null
  if (!dueDateReminders || dueDateReminders.length === 0) return null
  if (!isVisible) return null

  const activeReminders = dueDateReminders.filter(
    reminder => !dismissedReminders.has(reminder.id)
  )

  if (activeReminders.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full">
      <ModernCard variant="default" padding="none" className="shadow-lg border-l-4">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-lg">Return Reminders</h3>
              <ModernBadge variant="warning" size="sm">
                {activeReminders.length}
              </ModernBadge>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Reminders List */}
          <div className="space-y-3 mb-4">
            {activeReminders.slice(0, 3).map((reminder) => (
              <div
                key={reminder.id}
                className={`p-3 rounded-lg border-l-4 ${getUrgencyColor(reminder.days_until_due)}`}
              >
                <div className="flex items-start gap-3">
                  {getUrgencyIcon(reminder.days_until_due)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1 truncate">
                      {reminder.equipment_name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {formatDueDate(reminder.due_date)}
                      </span>
                      <span className={`text-xs font-medium ${
                        reminder.days_until_due < 0 ? 'text-red-600' :
                        reminder.days_until_due === 0 ? 'text-orange-600' :
                        'text-blue-600'
                      }`}>
                        {getUrgencyText(reminder.days_until_due)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissReminder(reminder.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <ModernButton
              variant="outline"
              size="sm"
              onClick={dismissAll}
              className="flex-1"
            >
              Dismiss All
            </ModernButton>
            <ModernButton
              variant="default"
              size="sm"
              onClick={() => {
                window.location.href = '/dashboard/my-borrowings'
                setIsVisible(false)
              }}
              className="flex-1"
            >
              View Borrowings
            </ModernButton>
          </div>
        </div>
      </ModernCard>
    </div>
  )
}