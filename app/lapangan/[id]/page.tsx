"use client"; 

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Lapangan, Booking } from '@/types/api';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Clock, DollarSign, Users, Shield, Calendar as CalendarIcon } from 'lucide-react';
import { getLapanganById } from '@/lib/lapangan';

export default function LapanganDetailPage() {
  const params = useParams();
  const [tanggal, setTanggal] = useState<Date | undefined>(new Date());
  const [selectedJam, setSelectedJam] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { toast } = useToast();
  
  const lapanganId = Number(params.id);
  const [lapangan, setLapangan] = useState<Lapangan | null>(null);

  // TODO: Ambil data booking dari database
  const bookingsForThisLapangan: Booking[] = [];

  const jamTersedia = [
    { jam: 9, tersedia: true }, { jam: 10, tersedia: false },
    { jam: 11, tersedia: true }, { jam: 12, tersedia: true },
    { jam: 13, tersedia: true }, { jam: 14, tersedia: false },
    { jam: 15, tersedia: false }, { jam: 16, tersedia: true },
    { jam: 17, tersedia: true }, { jam: 18, tersedia: true },
    { jam: 19, tersedia: true }, { jam: 20, tersedia: true },
  ];

  useEffect(() => {
    const fetchLapangan = async () => {
      try {
        setLoading(true);
        const lapanganData = getLapanganById(lapanganId);
        if (lapanganData) {
          setLapangan(lapanganData);
        } else {
          toast({
            title: "Error",
            description: "Lapangan tidak ditemukan.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching lapangan:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data lapangan.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (lapanganId) {
      fetchLapangan();
    }
  }, [lapanganId, toast]);
  
  if (!lapangan) {
    return <div className="container p-8">Lapangan tidak ditemukan</div>;
  }

  const handleBookingSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    
    const nama = formData.get('nama') as string;
    const email = formData.get('email') as string;
    const no_telp = formData.get('no_telp') as string;
    const tanggalBooking = tanggal?.toISOString().split('T')[0];
    const jam = formData.get('jam') as string;
    
    try {
      setBookingLoading(true);
      
      // Validasi data
      if (!nama || !email || !no_telp || !tanggalBooking || !jam) {
        toast({
          title: "Error",
          description: "Semua field harus diisi.",
          variant: "destructive",
        });
        return;
      }
      
      // Cek autentikasi
      const sessionResponse = await fetch('/api/auth/session');
      if (!sessionResponse.ok) {
        toast({
          title: "Login Required",
          description: "Silakan login terlebih dahulu untuk melakukan booking.",
          variant: "destructive",
        });
        return;
      }
      
      const userData = await sessionResponse.json();
      
      // Submit booking
      const bookingResponse = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lapanganId: lapangan.id,
          userId: userData.user.id,
          tanggal: tanggalBooking,
          jamMulai: parseInt(jam),
          jamSelesai: parseInt(jam) + 1, // Durasi 1 jam
          namaPemesan: nama,
          email: email,
          noTelp: no_telp,
        }),
      });
      
      const result = await bookingResponse.json();
      
      if (bookingResponse.ok) {
        toast({
          title: "Booking Berhasil",
          description: `Booking untuk ${lapangan.nama} telah berhasil dilakukan.`,
        });
        // Close dialog and reset form
        const dialog = event.currentTarget.closest('dialog');
        if (dialog) {
          dialog.close();
        }
      } else {
        toast({
          title: "Booking Gagal",
          description: result.message || "Gagal melakukan booking.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat melakukan booking.",
        variant: "destructive",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  // === BAGIAN RENDER (TAMPILAN) ===
  return (
    <main className="container mx-auto max-w-6xl p-4 md:p-8">
      {/* === JUDUL & GAMBAR === */}
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold">{lapangan.nama}</h1>
          <Badge variant="secondary" className="text-sm">Tersedia</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Jl. Sudirman No. 123</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Buka 24 jam</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>Rp {(lapangan.harga_per_jam || lapangan.hargaPerJam || 0).toLocaleString('id-ID')} / jam</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Muatan 5-6 orang</span>
          </div>
        </div>
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-4">
          <img 
            src={lapangan.gambar} 
            alt={lapangan.nama} 
            className="w-full h-auto max-h-[500px] object-cover" 
          />
          <div className="absolute inset-0 from-black/20 to-transparent"></div>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-500" />
          <span className="text-sm text-muted-foreground">Lapangan bersertifikat & aman</span>
        </div>
      </section>

      {/* === LAYOUT UTAMA (KIRI: INFO, KANAN: BOOKING) === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* === KOLOM KIRI (INFO DETAIL) === */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Deskripsi & Lokasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-4">
                {lapangan.deskripsi}
              </p>
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-semibold mb-2">Alamat Lengkap</h4>
                <p className="text-sm text-muted-foreground">Jl. Sudirman No. 123, Jakarta Pusat</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Fasilitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lapangan.fasilitas && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(Array.isArray(lapangan.fasilitas) ? lapangan.fasilitas : lapangan.fasilitas.split(',')).map((fasilitas, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{typeof fasilitas === 'string' ? fasilitas.trim() : fasilitas}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* === KOLOM KANAN (BOOKING PANEL) === */}
        <div className="md:col-span-1">
          {/* Card ini akan 'sticky' (diam di tempat) saat di-scroll */}
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <p className="text-3xl font-bold">
                Rp {lapangan.harga_per_jam.toLocaleString('id-ID')}
                <span className="text-base font-normal text-muted-foreground"> / jam</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Langkah 1: Pilih Tanggal */}
              <div>
                <h3 className="text-lg font-semibold mb-3">1. Pilih Tanggal</h3>
                <Calendar
                  mode="single"
                  selected={tanggal}
                  onSelect={setTanggal}
                  className="rounded-md border"
                  disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                />
              </div>

              {/* Langkah 2: Pilih Jam (Hanya muncul jika tanggal sudah dipilih) */}
              {tanggal && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">2. Pilih Jam</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Jadwal untuk: {tanggal.toLocaleDateString('id-ID', { dateStyle: 'full' })}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {jamTersedia.map((slot) => (
                      <Dialog key={slot.jam}>
                        <DialogTrigger asChild>
                          <Button 
                            variant={slot.tersedia ? "outline" : "destructive"} 
                            disabled={!slot.tersedia}
                            className="w-full"
                          >
                            {slot.jam}:00
                          </Button>
                        </DialogTrigger>
                        
                        {/* Pop-up Form Booking (Sama seperti sebelumnya, tapi lebih rapi) */}
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Calendar className="w-5 h-5" />
                              Konfirmasi Booking
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                              <h4 className="font-semibold mb-2">Detail Lapangan</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Nama:</span>
                                <span className="font-medium">{lapangan.nama}</span>
                                <span className="text-muted-foreground">Harga:</span>
                                <span className="font-medium">Rp {(lapangan.harga_per_jam || lapangan.hargaPerJam || 0).toLocaleString('id-ID')} / jam</span>
                                <span className="text-muted-foreground">Tanggal:</span>
                                <span className="font-medium">{tanggal?.toLocaleDateString('id-ID')}</span>
                                <span className="text-muted-foreground">Jam:</span>
                                <span className="font-medium">{slot.jam}:00</span>
                              </div>
                            </div>
                            <form onSubmit={handleBookingSubmit} className="space-y-4">
                              <div>
                                <Label htmlFor="nama">Nama Pemesan</Label>
                                <Input id="nama" name="nama" placeholder="Masukkan nama lengkap" required className="mt-1" />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="Masukkan email aktif" required className="mt-1" />
                              </div>
                              <div>
                                <Label htmlFor="no_telp">No. Telepon</Label>
                                <Input id="no_telp" name="no_telp" type="tel" placeholder="Masukkan nomor telepon" required className="mt-1" />
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="syarat" required />
                                <Label htmlFor="syarat" className="text-sm">Saya menyetujui syarat dan ketentuan</Label>
                              </div>
                              <div className="flex gap-2">
                                <Button type="submit" className="flex-1" disabled={bookingLoading}>
                                  {bookingLoading ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      Memproses...
                                    </>
                                  ) : (
                                    "Booking Sekarang"
                                  )}
                                </Button>
                                <Button type="button" variant="outline" onClick={(e) => {
                                  const button = e.currentTarget;
                                  const dialog = button.closest('dialog');
                                  if (dialog) {
                                    dialog.close();
                                  }
                                }} className="flex-1">
                                  Batal
                                </Button>
                              </div>
                            </form>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  );
}
