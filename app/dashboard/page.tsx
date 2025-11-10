"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CreditCard,
  BookOpen,
  Shield,
  ArrowRight
} from 'lucide-react';

interface Booking {
  id: number;
  lapangan_id: number;
  lapangan_nama: string;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_harga: number;
  created_at: string;
}

interface UserProfile {
  id: number;
  nama: string;
  email: string;
  no_telp: string;
  created_at: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user session
      const sessionResponse = await fetch('/api/auth/session');
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        setUser(sessionData.user);
      }

      // Fetch user's bookings
      const bookingsResponse = await fetch('/api/bookings/user');
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data dashboard. Silakan refresh halaman.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId })
      });

      if (response.ok) {
        setBookings(bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' as const }
            : booking
        ));
        toast({
          title: "Booking Dibatalkan",
          description: "Booking berhasil dibatalkan.",
        });
      } else {
        toast({
          title: "Pembatalan Gagal",
          description: "Gagal membatalkan booking. Silakan coba lagi.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '❌';
      case 'completed':
        return '✨';
      default:
        return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded-md mb-8 w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
          </div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Silakan login terlebih dahulu</h1>
        <Button onClick={() => window.location.href = '/login'}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      {/* === WELCOME SECTION === */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Selamat Datang, {user.nama.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Ini adalah dashboard Anda. Kelola booking dan informasi akun Anda di sini.
        </p>
      </div>

      {/* === QUICK ACTIONS === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Booking Baru</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Pesan lapangan futsal untuk sesi bermain Anda
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/lapangan'}
            >
              Cari Lapangan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Lihat Booking</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Periksa status dan detail booking Anda
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/profile'}
            >
              Lihat Semua
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Profil Saya</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Kelola informasi pribadi dan pengaturan akun
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/profile'}
            >
              Edit Profil
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* === RECENT BOOKINGS === */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Booking Terbaru</CardTitle>
              <CardDescription>Daftar booking Anda yang terbaru</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/profile'}
            >
              Lihat Semua Booking
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">Belum ada booking</p>
              <p className="text-sm text-muted-foreground">
                Buat booking pertama Anda sekarang!
              </p>
              <Button 
                className="mt-4"
                onClick={() => window.location.href = '/lapangan'}
              >
                Cari Lapangan
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">{booking.lapangan_nama}</div>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusIcon(booking.status)} {booking.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">Rp {booking.total_harga.toLocaleString('id-ID')}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(booking.tanggal).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{booking.jam_mulai} - {booking.jam_selesai}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Lapangan Futsal</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Batalkan
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = `/lapangan/${booking.lapangan_id}`}
                    >
                      Lihat Lapangan
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* === ACCOUNT SUMMARY === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
            <CardDescription>Detail akun Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{user.nama}</div>
                <div className="text-sm text-muted-foreground">Nama Lengkap</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{user.email}</div>
                <div className="text-sm text-muted-foreground">Email</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{user.no_telp || '-'}</div>
                <div className="text-sm text-muted-foreground">No. Telepon</div>
              </div>
            </div>
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/profile'}
              >
                Kelola Profil
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistik Booking</CardTitle>
            <CardDescription>Riwayat aktivitas Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </div>
                <div className="text-sm text-muted-foreground">Aktif</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Selesai</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Menunggu</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {bookings.filter(b => b.status === 'cancelled').length}
                </div>
                <div className="text-sm text-muted-foreground">Dibatalkan</div>
              </div>
            </div>
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/profile'}
              >
                Lihat Detail
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
