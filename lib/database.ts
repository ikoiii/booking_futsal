// Database connection configuration for MySQL with XAMPP
import mysql from 'mysql2/promise';
import type { User } from './auth';

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root', // Default XAMPP MySQL username
  password: '', // Default XAMPP MySQL password (usually empty)
  database: 'futsal_booking',
  port: 3306, // Default MySQL port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Execute query with error handling
export async function executeQuery(query: string, params?: any[]) {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('❌ Query execution failed:', error);
    throw error;
  }
}

// Execute transaction
export async function executeTransaction(queries: Array<{ query: string; params?: any[] }>) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params } of queries) {
      const [result] = await connection.execute(query, params);
      results.push(result);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    console.error('❌ Transaction failed:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Database helper functions
export const dbHelpers = {
  // Users
  async createUser(userData: {
    nama: string;
    email: string;
    password: string;
    no_telp: string;
  }) {
    const query = `
      INSERT INTO users (nama, email, password, no_telp, role)
      VALUES (?, ?, ?, ?, 'user')
    `;
    return await executeQuery(query, [
      userData.nama,
      userData.email,
      userData.password,
      userData.no_telp
    ]);
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = ?';
    const results = await executeQuery(query, [email]);
    return Array.isArray(results) && results.length > 0 ? results[0] as User : null;
  },

  async getUserById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = ?';
    const results = await executeQuery(query, [id]);
    return Array.isArray(results) && results.length > 0 ? results[0] as User : null;
  },

  async updateUser(id: number, userData: Partial<{
    nama: string;
    email: string;
    password: string;
    no_telp: string;
  }>) {
    const fields = [];
    const values = [];
    
    if (userData.nama) {
      fields.push('nama = ?');
      values.push(userData.nama);
    }
    if (userData.email) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    if (userData.password) {
      fields.push('password = ?');
      values.push(userData.password);
    }
    if (userData.no_telp) {
      fields.push('no_telp = ?');
      values.push(userData.no_telp);
    }
    
    fields.push('updated_at = NOW()');
    values.push(id);
    
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    return await executeQuery(query, values);
  },

  // Lapangans
  async getAllLapangans() {
    const query = 'SELECT * FROM lapangans WHERE status = "aktif" ORDER BY harga_per_jam';
    return await executeQuery(query);
  },

  async getLapanganById(id: number) {
    const query = 'SELECT * FROM lapangans WHERE id = ? AND status = "aktif"';
    const results = await executeQuery(query, [id]);
    return Array.isArray(results) ? results[0] : null;
  },

  // Bookings
  async createBooking(bookingData: {
    user_id: number;
    lapangan_id: number;
    tanggal: string;
    jam_mulai: number;
    jam_selesai: number;
    harga_per_jam: number;
  }) {
    const query = `
      INSERT INTO bookings (user_id, lapangan_id, tanggal, jam_mulai, jam_selesai, harga_per_jam, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `;
    return await executeQuery(query, [
      bookingData.user_id,
      bookingData.lapangan_id,
      bookingData.tanggal,
      bookingData.jam_mulai,
      bookingData.jam_selesai,
      bookingData.harga_per_jam
    ]);
  },

  async getBookingsByUserId(userId: number) {
    const query = `
      SELECT b.*, l.nama as lapangan_name, l.gambar as lapangan_gambar
      FROM bookings b
      JOIN lapangans l ON b.lapangan_id = l.id
      WHERE b.user_id = ?
      ORDER BY b.tanggal DESC, b.jam_mulai DESC
    `;
    return await executeQuery(query, [userId]);
  },

  async getBookingById(id: number) {
    const query = `
      SELECT b.*, l.nama as lapangan_name, l.gambar as lapangan_gambar
      FROM bookings b
      JOIN lapangans l ON b.lapangan_id = l.id
      WHERE b.id = ?
    `;
    const results = await executeQuery(query, [id]);
    return Array.isArray(results) ? results[0] : null;
  },

  async checkAvailability(lapanganId: number, tanggal: string, jamMulai: number, jamSelesai: number) {
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
    `;
    const results = await executeQuery(query, [
      lapanganId, tanggal, jamMulai, jamSelesai,
      jamMulai, jamSelesai, jamMulai, jamSelesai
    ]);
    return Array.isArray(results) ? results[0] : null;
  },

  async updateBookingStatus(bookingId: number, status: string) {
    const query = 'UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?';
    return await executeQuery(query, [status, bookingId]);
  },

  // Reviews
  async createReview(reviewData: {
    user_id: number;
    lapangan_id: number;
    booking_id: number;
    rating: number;
    komentar: string;
  }) {
    const query = `
      INSERT INTO reviews (user_id, lapangan_id, booking_id, rating, komentar)
      VALUES (?, ?, ?, ?, ?)
    `;
    return await executeQuery(query, [
      reviewData.user_id,
      reviewData.lapangan_id,
      reviewData.booking_id,
      reviewData.rating,
      reviewData.komentar
    ]);
  },

  async getReviewsByLapanganId(lapanganId: number) {
    const query = `
      SELECT r.*, u.nama as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.lapangan_id = ?
      ORDER BY r.created_at DESC
    `;
    return await executeQuery(query, [lapanganId]);
  },

  async getAverageRating(lapanganId: number) {
    const query = `
      SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
      FROM reviews
      WHERE lapangan_id = ?
    `;
    const results = await executeQuery(query, [lapanganId]);
    return Array.isArray(results) ? results[0] : null;
  },

  async getReviewByBookingId(bookingId: number) {
    const query = 'SELECT * FROM reviews WHERE booking_id = ?';
    const results = await executeQuery(query, [bookingId]);
    return Array.isArray(results) ? results[0] : null;
  },

  // Admin functions
  async getAllBookings() {
    const query = `
      SELECT b.*, u.nama as user_name, u.email as user_email, l.nama as lapangan_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN lapangans l ON b.lapangan_id = l.id
      ORDER BY b.tanggal DESC, b.jam_mulai DESC
    `;
    return await executeQuery(query);
  },

  async getAllUsers() {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    return await executeQuery(query);
  },

  async cancelBooking(bookingId: number) {
    const query = 'UPDATE bookings SET status = "cancelled", updated_at = NOW() WHERE id = ?';
    return await executeQuery(query, [bookingId]);
  }
};

export default pool;
