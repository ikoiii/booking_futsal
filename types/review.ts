// Review related types and interfaces

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

export interface ReviewFormData {
  booking_id: number
  rating: number
  komentar: string
}