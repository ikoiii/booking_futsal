"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, Shield, BarChart3, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'

interface AdminStats {
  totalBookings: number
  totalUsers: number
  totalLapangans: number
  pendingBookings: number
  revenue: number
}

interface RecentActivity {
  id: number
  type: 'booking' | 'user' | 'lapangan'
  description: string
  timestamp: string
  status?: string
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }

      // Fetch recent activities
      const activitiesResponse = await fetch('/api/admin/activities')
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json()
        setRecentActivities(activitiesData.activities || [])
      }
    } catch (error) {
      toast.error('Gagal memuat data admin')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    
    try {
      const response = await fetch(`/api/admin/search?q=${encodeURIComponent(searchTerm)}`)
      if (response.ok) {
        const data = await response.json()
        toast.success(`Ditemukan ${data.results.length} hasil`)
      } else {
        toast.error('Pencarian gagal')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mencari')
    }
  }

  if (loading && !stats) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center my-12">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 w-64 mx-auto rounded mb-4"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 h-32 w-full rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      {/* === HERO SECTION === */}
      <section className="text-center my-12 md:my-20">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Shield className="w-4 h-4" />
          Panel Admin
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Dashboard Admin
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Kelola sistem booking futsal dengan mudah dan efisien
        </p>
      </section>

      {/* === SEARCH BAR === */}
      <section className="mb-12">
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="adminSearch">Cari User, Booking, atau Lapangan</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="adminSearch"
                  placeholder="Cari berdasarkan nama, email, atau ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="self-end md:self-auto">
              <Search className="mr-2 h-4 w-4" />
              Cari
            </Button>
          </div>
        </div>
      </section>

      <hr className="my-12 border-muted" />

      {/* === STATS CARDS === */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-primary mb-2">
                    {stats?.totalBookings || 0}
                  </CardTitle>
                  <CardDescription>Total Booking</CardDescription>
                </div>
                <Calendar className="w-12 h-12 text-primary/20" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="warning">{stats?.pendingBookings || 0} Pending</Badge>
                <span className="text-xs text-muted-foreground">hari ini</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-green-600 mb-2">
                    {stats?.totalUsers || 0}
                  </CardTitle>
                  <CardDescription>Total User</CardDescription>
                </div>
                <Users className="w-12 h-12 text-green-600/20" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="success">Aktif</Badge>
                <span className="text-xs text-muted-foreground">bulan ini</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-purple-600 mb-2">
                    Rp {stats?.revenue?.toLocaleString('id-ID') || '0'}
                  </CardTitle>
                  <CardDescription>Pendapatan</CardDescription>
                </div>
                <BarChart3 className="w-12 h-12 text-purple-600/20" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="default">Bulan ini</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* === QUICK ACTIONS === */}
        <section className="mb-8 lg:mb-0">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Aksi Cepat</h2>
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/api/admin/bookings'}
                >
                  <Calendar className="mr-3 h-4 w-4" />
                  Kelola Booking
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/api/admin/users'}
                >
                  <Users className="mr-3 h-4 w-4" />
                  Kelola User
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/lapangan'}
                >
                  <Shield className="mr-3 h-4 w-4" />
                  Kelola Lapangan
                </Button>
                <Button 
                  variant="default" 
                  className="w-full justify-start mt-4"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <BarChart3 className="mr-3 h-4 w-4" />
                  Lihat Statistik Lengkap
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* === RECENT ACTIVITIES === */}
        <section>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Aktivitas Terkini</h2>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        {activity.type === 'booking' && (
                          <Calendar className="w-4 h-4 text-primary" />
                        )}
                        {activity.type === 'user' && (
                          <Users className="w-4 h-4 text-green-600" />
                        )}
                        {activity.type === 'lapangan' && (
                          <Shield className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                      {activity.status && (
                        <Badge variant={
                          activity.status === 'success' ? 'success' : 
                          activity.status === 'pending' ? 'warning' : 'destructive'
                        }>
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Tidak ada aktivitas terkini
                  </div>
                )}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" size="sm">
                  Muat Lebih Banyak
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}