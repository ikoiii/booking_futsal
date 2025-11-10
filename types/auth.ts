// User related types and interfaces

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