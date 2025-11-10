// API related types and interfaces

// Request/Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Re-export all types
export * from './auth'
export * from './booking'
export * from './review'