// Application constants

// Booking status constants
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
} as const

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
} as const

// Field status
export const FIELD_STATUS = {
  ACTIVE: 'aktif',
  INACTIVE: 'nonaktif'
} as const

// Operating hours
export const OPERATING_HOURS = {
  OPEN: 8, // 8 AM
  CLOSE: 23 // 11 PM
} as const

// Booking rules
export const BOOKING_RULES = {
  MAX_DURATION: 4, // Maximum 4 hours per booking
  MIN_DURATION: 1, // Minimum 1 hour per booking
  MAX_DAYS_ADVANCE: 30, // Maximum 30 days in advance
  CANCELLATION_DEADLINE: 2 // 2 hours before booking time
} as const

// Rating constants
export const RATING = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 0
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50
} as const

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp']
} as const