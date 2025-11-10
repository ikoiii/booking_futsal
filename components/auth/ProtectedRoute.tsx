'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '../ui/use-toast'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'user' | 'admin'
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = 'user',
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          setIsLoading(false)
          setIsAuthenticated(false)
          return
        }

        // Check token validity
        const response = await fetch('/api/auth/session', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          setIsAuthenticated(true)
          setUserRole(userData.data.role)
          
          // Check role requirement
          if (requiredRole === 'admin' && userData.data.role !== 'admin') {
            toast({
              title: 'Akses Ditolak',
              description: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
              variant: 'destructive'
            })
            router.push(redirectTo)
            return
          }
        } else {
          localStorage.removeItem('token')
          router.push(redirectTo)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push(redirectTo)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [requiredRole, redirectTo, router, toast])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}