import type { ApiResponse } from './database.types'

// Standard API Response Helpers
export class ApiHelpers {
  static success<T>(data?: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message: message || 'Berhasil'
    }
  }

  static error(message: string, error?: string): ApiResponse {
    return {
      success: false,
      message: message || 'Terjadi kesalahan',
      error
    }
  }

  static notFound(message: string = 'Data tidak ditemukan'): ApiResponse {
    return {
      success: false,
      message
    }
  }

  static badRequest(message: string = 'Permintaan tidak valid'): ApiResponse {
    return {
      success: false,
      message
    }
  }

  static unauthorized(message: string = 'Akses ditolak'): ApiResponse {
    return {
      success: false,
      message
    }
  }

  static forbidden(message: string = 'Akses tidak diizinkan'): ApiResponse {
    return {
      success: false,
      message
    }
  }

  static conflict(message: string = 'Konflik data'): ApiResponse {
    return {
      success: false,
      message
    }
  }
}

// Request Validation Helpers
export class ValidationHelpers {
  static validateRequired(data: any, requiredFields: string[]): string[] {
    const errors: string[] = []
    
    for (const field of requiredFields) {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        errors.push(`${field} wajib diisi`)
      }
    }
    
    return errors
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][0-9]{6,15}$/
    return phoneRegex.test(phone.replace(/\s|-|\(|\)/g, ''))
  }

  static validateDate(dateString: string): boolean {
    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date.getTime()) && date >= new Date()
  }

  static validateTimeRange(jamMulai: number, jamSelesai: number): boolean {
    return (
      jamMulai >= 0 && jamMulai <= 23 &&
      jamSelesai >= 0 && jamSelesai <= 23 &&
      jamSelesai > jamMulai &&
      jamSelesai - jamMulai <= 24
    )
  }

  static validateRating(rating: number): boolean {
    return rating >= 1 && rating <= 5 && Number.isInteger(rating)
  }
}

// Authentication Helpers
export class AuthHelpers {
  static async validateToken(token: string): Promise<{ valid: boolean; userId?: number; role?: string }> {
    try {
      const response = await fetch('/api/auth/session', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        return {
          valid: true,
          userId: data.user?.id,
          role: data.user?.role
        }
      }

      return { valid: false }
    } catch (error) {
      console.error('Token validation failed:', error)
      return { valid: false }
    }
  }

  static getTokenFromHeaders(headers: Headers): string | null {
    const authHeader = headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }
    return null
  }

  static isAdmin(role: string): boolean {
    return role === 'admin'
  }

  static isUser(role: string): boolean {
    return role === 'user' || role === 'admin'
  }
}

// Response Formatting Helpers
export class FormatHelpers {
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  static formatDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  static formatTime(jam: number): string {
    return `${jam.toString().padStart(2, '0')}:00`
  }

  static formatBookingDuration(jamMulai: number, jamSelesai: number): string {
    const duration = jamSelesai - jamMulai
    return `${duration} jam`
  }

  static truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }
}

// Error Handling Helpers
export class ErrorHelpers {
  static handleDatabaseError(error: any): ApiResponse {
    console.error('Database error:', error)
    
    if (error.code === 'ER_DUP_ENTRY') {
      return ApiHelpers.conflict('Data sudah ada')
    }
    
    if (error.code === 'ER_NO_REFERENCED_ROW') {
      return ApiHelpers.badRequest('Referensi data tidak valid')
    }
    
    return ApiHelpers.error('Gagal memproses data', error.message)
  }

  static handleValidationError(errors: string[]): ApiResponse {
    return ApiHelpers.badRequest('Validasi data gagal', errors.join(', '))
  }

  static handleNotFoundError(entity: string): ApiResponse {
    return ApiHelpers.notFound(`${entity} tidak ditemukan`)
  }

  static handleServerError(error: any): ApiResponse {
    console.error('Server error:', error)
    return ApiHelpers.error('Terjadi kesalahan server')
  }
}

// Search and Filter Helpers
export class SearchHelpers {
  static parseSearchParams(searchParams: URLSearchParams): {
    keyword?: string
    location?: string
    minPrice?: number
    maxPrice?: number
    facilities?: string[]
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } {
    return {
      keyword: searchParams.get('keyword') || undefined,
      location: searchParams.get('location') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      facilities: searchParams.getAll('facilities'),
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      sortBy: searchParams.get('sortBy') || 'created_at',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
    }
  }

  static buildSearchQuery(params: any): { query: string; values: any[] } {
    let query = ''
    const values: any[] = []
    
    // Add WHERE conditions based on params
    if (params.keyword) {
      query += ' AND (nama LIKE ? OR deskripsi LIKE ?)'
      values.push(`%${params.keyword}%`, `%${params.keyword}%`)
    }
    
    if (params.location) {
      query += ' AND lokasi LIKE ?'
      values.push(`%${params.location}%`)
    }
    
    if (params.minPrice !== undefined) {
      query += ' AND harga_per_jam >= ?'
      values.push(params.minPrice)
    }
    
    if (params.maxPrice !== undefined) {
      query += ' AND harga_per_jam <= ?'
      values.push(params.maxPrice)
    }
    
    return { query, values }
  }
}