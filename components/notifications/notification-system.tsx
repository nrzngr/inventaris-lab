'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { toast } from 'sonner'
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react'

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  timestamp: Date
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      duration: notification.duration || 5000
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    // Also show toast for immediate feedback
    const toastConfig = {
      duration: notification.duration,
      action: notification.action
    }

    switch (notification.type) {
      case 'success':
        toast.success(notification.title, toastConfig)
        break
      case 'error':
        toast.error(notification.title, toastConfig)
        break
      case 'warning':
        toast.warning(notification.title, toastConfig)
        break
      case 'info':
        toast.info(notification.title, toastConfig)
        break
    }
  }, [removeNotification])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

function NotificationItem({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'info':
        return 'border-blue-200 bg-blue-50'
    }
  }

  return (
    <div className={`border rounded-lg p-4 shadow-lg ${getStyles()} animate-in slide-in-from-right-full`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900">
              {notification.title}
            </h4>
            {notification.message && (
              <p className="mt-1 text-sm text-gray-600">
                {notification.message}
              </p>
            )}
            {notification.action && (
              <button
                onClick={notification.action.onClick}
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {notification.action.label}
              </button>
            )}
            <div className="mt-1 text-xs text-gray-500">
              {notification.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-md hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  )
}

// Hook for real-time subscriptions
export function useRealtimeNotifications() {
  const { addNotification } = useNotifications()

  const notifyEquipmentUpdate = useCallback((equipmentName: string, action: 'created' | 'updated' | 'deleted') => {
    const messages = {
      created: { title: 'Equipment Added', message: `${equipmentName} has been added to inventory`, type: 'success' as const },
      updated: { title: 'Equipment Updated', message: `${equipmentName} has been updated`, type: 'info' as const },
      deleted: { title: 'Equipment Deleted', message: `${equipmentName} has been removed from inventory`, type: 'warning' as const }
    }

    const config = messages[action]
    addNotification({
      ...config,
      duration: 4000
    })
  }, [addNotification])

  const notifyBorrowingUpdate = useCallback((equipmentName: string, userName: string, action: 'borrowed' | 'returned' | 'overdue') => {
    const messages = {
      borrowed: { title: 'Equipment Borrowed', message: `${userName} borrowed ${equipmentName}`, type: 'info' as const },
      returned: { title: 'Equipment Returned', message: `${userName} returned ${equipmentName}`, type: 'success' as const },
      overdue: { title: 'Equipment Overdue', message: `${equipmentName} is overdue for return`, type: 'warning' as const }
    }

    const config = messages[action]
    addNotification({
      ...config,
      duration: 6000,
      action: action === 'overdue' ? {
        label: 'View Transactions',
        onClick: () => window.location.href = '/dashboard/transactions'
      } : undefined
    })
  }, [addNotification])

  const notifyMaintenanceUpdate = useCallback((equipmentName: string, action: 'scheduled' | 'completed' | 'required') => {
    const messages = {
      scheduled: { title: 'Maintenance Scheduled', message: `Maintenance has been scheduled for ${equipmentName}`, type: 'info' as const },
      completed: { title: 'Maintenance Completed', message: `Maintenance has been completed for ${equipmentName}`, type: 'success' as const },
      required: { title: 'Maintenance Required', message: `${equipmentName} requires maintenance`, type: 'warning' as const }
    }

    const config = messages[action]
    addNotification({
      ...config,
      duration: 5000
    })
  }, [addNotification])

  const notifySystemError = useCallback((error: string, context?: string) => {
    addNotification({
      type: 'error',
      title: 'System Error',
      message: context ? `${context}: ${error}` : error,
      duration: 8000
    })
  }, [addNotification])

  const notifyBulkOperation = useCallback((action: string, count: number, success: boolean) => {
    addNotification({
      type: success ? 'success' : 'error',
      title: `Bulk ${action}`,
      message: `${success ? 'Successfully' : 'Failed to'} ${action.toLowerCase()} ${count} item${count > 1 ? 's' : ''}`,
      duration: 4000
    })
  }, [addNotification])

  return {
    notifyEquipmentUpdate,
    notifyBorrowingUpdate,
    notifyMaintenanceUpdate,
    notifySystemError,
    notifyBulkOperation
  }
}