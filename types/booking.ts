// Booking related types and interfaces

export interface Lapangan {
  id: number
  nama: string
  lokasi: string
  harga_per_jam: number
  // Support both string and array format for backward compatibility
  fasilitas: string | string[]
  gambar: string
  deskripsi: string
  status: 'aktif' | 'nonaktif'
  created_at: string
  updated_at: string
  // Legacy support
  hargaPerJam?: number
}

export interface Booking {
  id: number
  user_id: number
  lapangan_id: number
  tanggal: string
  jam_mulai: number
  jam_selesai: number
  harga_per_jam: number
  total_harga: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  updated_at: string
  // Extended with joins
  user_name?: string
  user_email?: string
  lapangan_name?: string
  lapangan_gambar?: string
  lapangan_lokasi?: string
}

export interface AvailabilityCheck {
  conflict_count: number
}

export interface BookingStatusUpdate {
  status: Booking['status']
}

export interface SearchParams {
  keyword?: string
  location?: string
  minPrice?: number
  maxPrice?: number
  facilities?: string[]
}

export interface BookingFormData {
  lapangan_id: number
  tanggal: string
  jam_mulai: number
  jam_selesai: number
}