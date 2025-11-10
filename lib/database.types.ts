// Database Types and Interfaces

export interface User {
  id: number
  nama: string
  email: string
  password?: string
  no_telp: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface Lapangan {
  id: number
  nama: string
  lokasi: string
  harga_per_jam: number
  fasilitas: string
  gambar: string
  deskripsi: string
  status: 'aktif' | 'nonaktif'
  created_at: string
  updated_at: string
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
}

export interface Review {
  id: number
  user_id: number
  lapangan_id: number
  booking_id: number
  rating: number
  komentar: string
  created_at: string
  updated_at: string
  // Extended with joins
  user_name?: string
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

// Request/Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface AuthUser {
  id: number
  nama: string
  email: string
  no_telp: string
  role: 'user' | 'admin'
}

// Form Data Types
export interface RegisterFormData {
  nama: string
  email: string
  password: string
  no_telp: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface BookingFormData {
  lapangan_id: number
  tanggal: string
  jam_mulai: number
  jam_selesai: number
}

export interface ReviewFormData {
  booking_id: number
  rating: number
  komentar: string
}