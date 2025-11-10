"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';
import { Lapangan } from "@/types/api";

export default function HomePage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      
      {/* === HERO SECTION === */}
      <section className="text-center my-12 md:my-20">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Calendar className="w-4 h-4" />
          Booking instan & jadwal pasti
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Temukan & Booking Lapangan Futsal
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Booking instan, jadwal pasti, main tanpa henti. Lihat pilihan lapangan terbaik di kota Anda.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#daftar-lapangan">Lihat Lapangan</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/register">Daftar Sekarang</Link>
          </Button>
        </div>
      </section>

      <hr className="my-12 border-muted" />

      {/* === DAFTAR LAPANGAN === */}
      <section id="daftar-lapangan" className="mb-12">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-3xl font-semibold">Pilihan Lapangan</h2>
          <div className="w-16 h-1 bg-primary rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* TODO: Tampilkan data lapangan dari database */}
          {([] as Lapangan[]).map((lapangan) => (
            <div 
              key={lapangan.id} 
              className="overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border-none hover:border-primary/20 cursor-pointer"
              onClick={() => window.location.href = `/lapangan/${lapangan.id}`}
            >
              <Card className="overflow-hidden">
                <div className="relative">
                  {/* Gambar with efek zoom-in saat hover */}
                  <img 
                    src={lapangan.gambar} 
                    alt={lapangan.nama} 
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  {/* Badge Harga */}
                  <Badge className="absolute top-3 right-3 bg-primary hover:bg-primary/90" variant="default">
                    Rp {(lapangan.harga_per_jam || lapangan.hargaPerJam || 0).toLocaleString('id-ID')} / jam
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Lokasi: Jl. Sudirman</span>
                  </div>
                  <CardTitle className="mb-2 text-xl">{lapangan.nama}</CardTitle>
                  {/* line-clamp-2 membatasi deskripsi jadi 2 baris */}
                  <CardDescription className="line-clamp-2 mb-4"> 
                    {lapangan.deskripsi}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/lapangan/${lapangan.id}`;
                      }}
                    >
                      Lihat Detail
                    </Button>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <Clock className="w-3 h-3" />
                      <span>Buka 24 jam</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
