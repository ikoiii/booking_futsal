// Database connection configuration for MySQL with XAMPP
import mysql from 'mysql2/promise'

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
}

// Create connection pool
const pool = mysql.createPool(dbConfig)

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log('✅ Database connection successful')
    connection.release()
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

// Execute query with error handling
export async function executeQuery(query: string, params?: any[]) {
  try {
    const [rows] = await pool.execute(query, params)
    return rows
  } catch (error) {
    console.error('❌ Query execution failed:', error)
    throw error
  }
}

// Execute transaction
export async function executeTransaction(queries: Array<{ query: string; params?: any[] }>) {
  const connection = await pool.getConnection()
  
  try {
    await connection.beginTransaction()
    
    const results = []
    for (const { query, params } of queries) {
      const [result] = await connection.execute(query, params)
      results.push(result)
    }
    
    await connection.commit()
    return results
  } catch (error) {
    await connection.rollback()
    console.error('❌ Transaction failed:', error)
    throw error
  } finally {
    connection.release()
  }
}

export default pool