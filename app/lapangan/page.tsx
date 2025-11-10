"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'

interface Lapangan {
  id: number
  nama: string
  lokasi: string
  hargaPerJam: number
  deskripsi: string
  gambar: string
  fasilitas: string[]
  jamOperasional: string
  rating: number
  totalUlasan: number
}

export default function LapanganPage() {
  const [lapangans, setLapangans] = useState<Lapangan[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    hargaMin: '',
    hargaMax: '',
    ratingMin: '',
    fasilitas: ''
  })

  useEffect(() => {
    fetchLapangans()
  }, [])

  const fetchLapangans = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/search/lapangans')
      if (response.ok) {
        const data = await response.json()
        setLapangans(data.lapangans || [])
      } else {
        toast.error('Gagal memuat data lapangan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (searchTerm) queryParams.append('search', searchTerm)
      if (filters.hargaMin) queryParams.append('hargaMin', filters.hargaMin)
      if (filters.hargaMax) queryParams.append('hargaMax', filters.hargaMax)
      if (filters.ratingMin) queryParams.append('ratingMin', filters.ratingMin)
      if (filters.fasilitas) queryParams.append('fasilitas', filters.fasilitas)

      const response = await fetch(`/api/search/lapangans?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setLapangans(data.lapangans || [])
      } else {
        toast.error('Gagal mencari lapangan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mencari')
    } finally {
      setLoading(false)
    }
  }

  const filteredLapangans = lapangans.filter(lapangan => {
    if (searchTerm && !lapangan.nama.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    if (filters.hargaMin && lapangan.hargaPerJam < parseInt(filters.hargaMin)) {
      return false
    }
    if (filters.hargaMax && lapangan.hargaPerJam > parseInt(filters.hargaMax)) {
      return false
    }
    if (filters.ratingMin && lapangan.rating < parseFloat(filters.ratingMin)) {
      return false
    }
    return true
  })

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center my-12">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 w-64 mx-auto rounded mb-4"></div>
            <div className="bg-gray-300 h-4 w-96 mx-auto rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 h-48 w-full rounded-lg mb-4"></div>
              <div className="bg-gray-300 h-6 w-3/4 rounded mb-2"></div>
              <div className="bg-gray-300 h-4 w-full rounded mb-2"></div>
              <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
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
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Temukan Lapangan Futsal Terbaik
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Pilih lapangan terbaik di kota Anda dengan berbagai pilihan fasilitas dan harga
        </p>
      </section>

      {/* === SEARCH & FILTER SECTION === */}
      <section className="mb-12">
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="lg:col-span-2">
              <Label htmlFor="search">Cari Lapangan</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Cari berdasarkan nama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="hargaMin">Harga Min (Rp)</Label>
              <Input
                id="hargaMin"
                type="number"
                placeholder="50000"
                value={filters.hargaMin}
                onChange={(e) => setFilters({...filters, hargaMin: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="hargaMax">Harga Max (Rp)</Label>
              <Input
                id="hargaMax"
                type="number"
                placeholder="200000"
                value={filters.hargaMax}
                onChange={(e) => setFilters({...filters, hargaMax: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="ratingMin">Rating Min</Label>
              <Input
                id="ratingMin"
                type="number"
                step="0.1"
                placeholder="4.0"
                value={filters.ratingMin}
                onChange={(e) => setFilters({...filters, ratingMin: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Button onClick={handleSearch} className="w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Cari Lapangan
            </Button>
          </div>
        </div>
      </section>

      <hr className="my-12 border-muted" />

      {/* === LAPANGAN LIST === */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold">
            {filteredLapangans.length > 0 ? `Ditemukan ${filteredLapangans.length} Lapangan` : 'Tidak Ada Hasil'}
          </h2>
          {filteredLapangans.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Temukan lapangan terbaik untuk pertandingan Anda
            </div>
          )}
        </div>
        
        {filteredLapangans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLapangans.map((lapangan) => (
              <div 
                key={lapangan.id} 
                className="overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border-none hover:border-primary/20 cursor-pointer"
                onClick={() => window.location.href = `/lapangan/${lapangan.id}`}
              >
                <Card className="overflow-hidden h-full">
                  <div className="relative">
                    {/* Gambar with efek zoom-in saat hover */}
                    <img 
                      src={lapangan.gambar || '/placeholder-lapangan.jpg'} 
                      alt={lapangan.nama} 
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    {/* Badge Harga */}
                    <Badge className="absolute top-3 right-3 bg-primary hover:bg-primary/90" variant="default">
                      Rp {lapangan.hargaPerJam.toLocaleString('id-ID')} / jam
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{lapangan.lokasi}</span>
                    </div>
                    <CardTitle className="mb-2 text-xl">{lapangan.nama}</CardTitle>
                    {/* line-clamp-2 membatasi deskripsi jadi 2 baris */}
                    <CardDescription className="line-clamp-2 mb-4"> 
                      {lapangan.deskripsi}
                    </CardDescription>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4 text-sm">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-medium">{lapangan.rating}</span>
                      <span className="text-muted-foreground">({lapangan.totalUlasan} ulasan)</span>
                    </div>

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
                        <span>{lapangan.jamOperasional}</span>
                      </div>
                    </div>

                    {/* Fasilitas */}
                    {lapangan.fasilitas && lapangan.fasilitas.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">Fasilitas:</p>
                        <div className="flex flex-wrap gap-1">
                          {lapangan.fasilitas.slice(0, 3).map((fasilitas, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {fasilitas}
                            </Badge>
                          ))}
                          {lapangan.fasilitas.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{lapangan.fasilitas.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tidak ada lapangan yang ditemukan</h3>
            <p className="text-muted-foreground mb-4">
              Coba ubah kriteria pencarian Anda atau cek kembali nanti
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('')
              setFilters({ hargaMin: '', hargaMax: '', ratingMin: '', fasilitas: '' })
            }}>
              Reset Pencarian
            </Button>
          </div>
        )}
      </section>
    </main>
  )
}