import { executeQuery, executeTransaction } from './database'
import type { 
  User, 
  Lapangan, 
  Booking, 
  Review, 
  AvailabilityCheck, 
  SearchParams 
} from './database.types'

// User Management
export class UserHelpers {
  static async createUser(userData: {
    nama: string
    email: string
    password: string
    no_telp: string
  }) {
    const query = `
      INSERT INTO users (nama, email, password, no_telp, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'user', NOW(), NOW())
    `
    await executeQuery(query, [
      userData.nama,
      userData.email,
      userData.password,
      userData.no_telp
    ])
    
    return await this.getUserByEmail(userData.email)
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = ?'
    const results = await executeQuery(query, [email])
    return results?.[0] || null
  }

  static async getUserById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = ?'
    const results = await executeQuery(query, [id])
    return results?.[0] || null
  }

  static async updateUser(id: number, userData: Partial<{
    nama: string
    email: string
    password: string
    no_telp: string
  }>) {
    const fields = []
    const values = []
    
    if (userData.nama) {
      fields.push('nama = ?')
      values.push(userData.nama)
    }
    if (userData.email) {
      fields.push('email = ?')
      values.push(userData.email)
    }
    if (userData.password) {
      fields.push('password = ?')
      values.push(userData.password)
    }
    if (userData.no_telp) {
      fields.push('no_telp = ?')
      values.push(userData.no_telp)
    }
    
    fields.push('updated_at = NOW()')
    values.push(id)
    
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`
    await executeQuery(query, values)
    return await this.getUserById(id)
  }

  static async getAllUsers(): Promise<User[]> {
    const query = 'SELECT id, nama, email, no_telp, role, created_at, updated_at FROM users ORDER BY created_at DESC'
    return await executeQuery(query)
  }
}

// Lapangan Management
export class LapanganHelpers {
  static async getAllLapangans() {
    const query = 'SELECT * FROM lapangans WHERE status = "aktif" ORDER BY harga_per_jam'
    return await executeQuery(query)
  }

  static async getLapanganById(id: number) {
    const query = 'SELECT * FROM lapangans WHERE id = ? AND status = "aktif"'
    const results = await executeQuery(query, [id])
    return results?.[0] || null
  }

  static async searchLapangans(params: SearchParams) {
    let query = `
      SELECT * FROM lapangans 
      WHERE status = 'aktif'
    `
    const paramsArray: any[] = []
    
    if (params.keyword) {
      query += ' AND (nama LIKE ? OR deskripsi LIKE ?)'
      paramsArray.push(`%${params.keyword}%`, `%${params.keyword}%`)
    }
    
    if (params.location) {
      query += ' AND lokasi LIKE ?'
      paramsArray.push(`%${params.location}%`)
    }
    
    if (params.minPrice !== undefined) {
      query += ' AND harga_per_jam >= ?'
      paramsArray.push(params.minPrice)
    }
    
    if (params.maxPrice !== undefined) {
      query += ' AND harga_per_jam <= ?'
      paramsArray.push(params.maxPrice)
    }
    
    query += ' ORDER BY harga_per_jam'
    
    return await executeQuery(query, paramsArray)
  }
}

// Booking Management
export class BookingHelpers {
  static async createBooking(bookingData: {
    user_id: number
    lapangan_id: number
    tanggal: string
    jam_mulai: number
    jam_selesai: number
    harga_per_jam: number
  }) {
    const total_harga = (bookingData.jam_selesai - bookingData.jam_mulai) * bookingData.harga_per_jam
    
    const query = `
      INSERT INTO bookings (
        user_id, lapangan_id, tanggal, jam_mulai, jam_selesai, 
        harga_per_jam, total_harga, status, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())
    `
    await executeQuery(query, [
      bookingData.user_id,
      bookingData.lapangan_id,
      bookingData.tanggal,
      bookingData.jam_mulai,
      bookingData.jam_selesai,
      bookingData.harga_per_jam,
      total_harga
    ])
    
    const insertIdResult = await executeQuery('SELECT LAST_INSERT_ID() as id', [])
    const newBookingId = insertIdResult?.[0]?.id
    
    return await this.getBookingById(newBookingId)
  }

  static async getBookingsByUserId(userId: number) {
    const query = `
      SELECT 
        b.*, 
        l.nama as lapangan_name, 
        l.gambar as lapangan_gambar,
        l.lokasi as lapangan_lokasi
      FROM bookings b
      JOIN lapangans l ON b.lapangan_id = l.id
      WHERE b.user_id = ?
      ORDER BY b.tanggal DESC, b.jam_mulai DESC
    `
    return await executeQuery(query, [userId])
  }

  static async getBookingById(id: number) {
    const query = `
      SELECT 
        b.*, 
        l.nama as lapangan_name, 
        l.gambar as lapangan_gambar,
        l.lokasi as lapangan_lokasi,
        u.nama as user_name,
        u.email as user_email
      FROM bookings b
      JOIN lapangans l ON b.lapangan_id = l.id
      JOIN users u ON b.user_id = u.id
      WHERE b.id = ?
    `
    const results = await executeQuery(query, [id])
    return results?.[0] || null
  }

  static async getAllBookings() {
    const query = `
      SELECT 
        b.*, 
        u.nama as user_name, 
        u.email as user_email, 
        l.nama as lapangan_name,
        l.lokasi as lapangan_lokasi
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN lapangans l ON b.lapangan_id = l.id
      ORDER BY b.tanggal DESC, b.jam_mulai DESC
    `
    return await executeQuery(query)
  }

  static async checkAvailability(lapanganId: number, tanggal: string, jamMulai: number, jamSelesai: number) {
    const query = `
      SELECT COUNT(*) as conflict_count
      FROM bookings
      WHERE lapangan_id = ?
      AND tanggal = ?
      AND status NOT IN ('cancelled')
      AND (
        (jam_mulai >= ? AND jam_mulai < ?) OR
        (jam_selesai > ? AND jam_selesai <= ?) OR
        (jam_mulai <= ? AND jam_selesai >= ?)
      )
    `
    const results = await executeQuery(query, [
      lapanganId, tanggal, jamMulai, jamSelesai,
      jamMulai, jamSelesai, jamMulai, jamSelesai
    ])
    return results?.[0] || { conflict_count: 0 }
  }

  static async updateBookingStatus(bookingId: number, status: Booking['status']) {
    const query = 'UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?'
    await executeQuery(query, [status, bookingId])
    return await this.getBookingById(bookingId)
  }

  static async cancelBooking(bookingId: number) {
    const query = 'UPDATE bookings SET status = "cancelled", updated_at = NOW() WHERE id = ?'
    await executeQuery(query, [bookingId])
    return await this.getBookingById(bookingId)
  }
}

// Review Management
export class ReviewHelpers {
  static async createReview(reviewData: {
    user_id: number
    lapangan_id: number
    booking_id: number
    rating: number
    komentar: string
  }) {
    const query = `
      INSERT INTO reviews (user_id, lapangan_id, booking_id, rating, komentar, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `
    await executeQuery(query, [
      reviewData.user_id,
      reviewData.lapangan_id,
      reviewData.booking_id,
      reviewData.rating,
      reviewData.komentar
    ])
    
    return await this.getReviewByBookingId(reviewData.booking_id)
  }

  static async getReviewsByLapanganId(lapanganId: number) {
    const query = `
      SELECT r.*, u.nama as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.lapangan_id = ?
      ORDER BY r.created_at DESC
    `
    return await executeQuery(query, [lapanganId])
  }

  static async getAverageRating(lapanganId: number) {
    const query = `
      SELECT 
        AVG(rating) as avg_rating, 
        COUNT(*) as total_reviews,
        GROUP_CONCAT(rating) as rating_distribution
      FROM reviews
      WHERE lapangan_id = ?
    `
    const results = await executeQuery(query, [lapanganId])
    return results?.[0] || { avg_rating: 0, total_reviews: 0 }
  }

  static async getReviewByBookingId(bookingId: number) {
    const query = 'SELECT * FROM reviews WHERE booking_id = ?'
    const results = await executeQuery(query, [bookingId])
    return results?.[0] || null
  }

  static async hasUserReviewed(userId: number, lapanganId: number) {
    const query = 'SELECT COUNT(*) as has_reviewed FROM reviews WHERE user_id = ? AND lapangan_id = ?'
    const results = await executeQuery(query, [userId, lapanganId])
    return results?.[0]?.has_reviewed > 0
  }
}

// Analytics and Reports
export class AnalyticsHelpers {
  static async getBookingStats() {
    const query = `
      SELECT 
        status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM bookings), 2) as percentage
      FROM bookings 
      WHERE status != 'cancelled'
      GROUP BY status
    `
    return await executeQuery(query)
  }

  static async getRevenueStats() {
    const query = `
      SELECT 
        DATE(tanggal) as date,
        COUNT(*) as bookings_count,
        SUM(total_harga) as total_revenue
      FROM bookings 
      WHERE status = 'completed'
      GROUP BY DATE(tanggal)
      ORDER BY date DESC
      LIMIT 30
    `
    return await executeQuery(query)
  }

  static async getPopularLapangans() {
    const query = `
      SELECT 
        l.id,
        l.nama,
        l.lokasi,
        COUNT(b.id) as booking_count,
        AVG(r.rating) as avg_rating
      FROM lapangans l
      LEFT JOIN bookings b ON l.id = b.lapangan_id AND b.status = 'completed'
      LEFT JOIN reviews r ON l.id = r.lapangan_id
      WHERE l.status = 'aktif'
      GROUP BY l.id, l.nama, l.lokasi
      ORDER BY booking_count DESC
      LIMIT 10
    `
    return await executeQuery(query)
  }
}