// Form validation schemas using Zod
import { z } from 'zod';

// User registration schema
export const registerSchema = z.object({
  nama: z
    .string()
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  
  email: z
    .string()
    .email('Format email tidak valid')
    .max(150, 'Email maksimal 150 karakter'),
  
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter')
    .max(100, 'Password maksimal 100 karakter')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password harus mengandung huruf besar, huruf kecil, dan angka'),
  
  no_telp: z
    .string()
    .min(10, 'Nomor telepon minimal 10 digit')
    .max(15, 'Nomor telepon maksimal 15 digit')
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Format nomor telepon tidak valid'),
  
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

// User login schema
export const loginSchema = z.object({
  email: z
    .string()
    .email('Format email tidak valid')
    .max(150, 'Email maksimal 150 karakter'),
  
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter')
    .max(100, 'Password maksimal 100 karakter'),
});

// User profile update schema
export const profileSchema = z.object({
  nama: z
    .string()
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .optional(),
  
  email: z
    .string()
    .email('Format email tidak valid')
    .max(150, 'Email maksimal 150 karakter')
    .optional(),
  
  no_telp: z
    .string()
    .min(10, 'Nomor telepon minimal 10 digit')
    .max(15, 'Nomor telepon maksimal 15 digit')
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Format nomor telepon tidak valid')
    .optional(),
  
  currentPassword: z
    .string()
    .optional(),
  
  newPassword: z
    .string()
    .min(6, 'Password minimal 6 karakter')
    .max(100, 'Password maksimal 100 karakter')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password harus mengandung huruf besar, huruf kecil, dan angka')
    .optional(),
  
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  // If newPassword is provided, currentPassword must also be provided
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Password saat ini wajib diisi jika ingin mengubah password",
  path: ["currentPassword"],
}).refine((data) => {
  // If newPassword is provided, confirmNewPassword must match
  if (data.newPassword && data.confirmNewPassword) {
    return data.newPassword === data.confirmNewPassword;
  }
  return true;
}, {
  message: "Password baru dan konfirmasi password baru tidak cocok",
  path: ["confirmNewPassword"],
});

// Booking schema
export const bookingSchema = z.object({
  tanggal: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), 'Tanggal tidak valid'),
  
  jam_mulai: z
    .number()
    .min(0, 'Jam mulai tidak valid')
    .max(23, 'Jam mulai tidak valid'),
  
  jam_selesai: z
    .number()
    .min(1, 'Jam selesai tidak valid')
    .max(24, 'Jam selesai tidak valid'),
  
  lapangan_id: z
    .number()
    .positive('Lapangan tidak valid'),
  
  metode_pembayaran: z
    .enum(['cash', 'transfer'], 'Metode pembayaran tidak valid'),
  
  catatan: z
    .string()
    .max(500, 'Catatan maksimal 500 karakter')
    .optional(),
}).refine((data) => data.jam_selesai > data.jam_mulai, {
  message: "Jam selesai harus lebih besar dari jam mulai",
  path: ["jam_selesai"],
});

// Review schema
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Rating minimal 1')
    .max(5, 'Rating maksimal 5'),
  
  komentar: z
    .string()
    .min(10, 'Komentar minimal 10 karakter')
    .max(500, 'Komentar maksimal 500 karakter'),
  
  lapangan_id: z
    .number()
    .positive('Lapangan tidak valid'),
  
  booking_id: z
    .number()
    .positive('Booking tidak valid'),
});

// Re-export types from types directory
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;

