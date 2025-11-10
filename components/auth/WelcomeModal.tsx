'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Home, Calendar, MapPin, User, Shield } from 'lucide-react'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  userRole: 'user' | 'admin'
}

export function WelcomeModal({ isOpen, onClose, userName, userRole }: WelcomeModalProps) {
  const router = useRouter()
  
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const userActions = [
    {
      id: 'browse',
      title: 'Jelajahi Lapangan',
      description: 'Temukan lapangan futsal terbaik di kota Anda',
      icon: MapPin,
      action: () => router.push('/lapangan')
    },
    {
      id: 'bookings',
      title: 'Lihat Booking Saya',
      description: 'Kelola semua booking yang telah Anda buat',
      icon: Calendar,
      action: () => router.push('/profile')
    },
    {
      id: 'dashboard',
      title: 'Ke Dashboard',
      description: 'Lihat ringkasan aktivitas dan statistik Anda',
      icon: Home,
      action: () => router.push('/dashboard')
    }
  ]

  const adminActions = [
    ...userActions,
    {
      id: 'admin',
      title: 'Panel Admin',
      description: 'Kelola booking, user, dan lapangan',
      icon: Shield,
      action: () => router.push('/admin')
    }
  ]

  const availableActions = userRole === 'admin' ? adminActions : userActions

  useEffect(() => {
    if (isOpen) {
      setSelectedAction(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Selamat Datang, {userName}!
            </h2>
            <p className="text-muted-foreground mt-2">
              Anda telah login sebagai {userRole === 'admin' ? 'Administrator' : 'User'}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {availableActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant={selectedAction === action.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedAction(action.id)
                    setTimeout(() => {
                      action.action()
                    }, 200)
                  }}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {action.title}
                  <span className="ml-auto text-xs text-muted-foreground">
                    →
                  </span>
                </Button>
              )
            })}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                router.push('/')
                onClose()
              }}
            >
              Tetap di Beranda
            </Button>
            <Button
              className="flex-1"
              onClick={onClose}
            >
              Pilih Nanti
            </Button>
          </div>

          {userRole === 'admin' && (
            <div className="mt-4 p-3 bg-primary/5 rounded-md">
              <p className="text-xs text-primary text-center">
                💡 Tips: Sebagai admin, Anda bisa mengelola semua booking dan user melalui panel admin.
              </p>
            </div>
          )}
        </CardContent>
      </div>
    </div>
  )
}

export default WelcomeModal