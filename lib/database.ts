// Database connection configuration for MySQL with XAMPP
import mysql from 'mysql2/promise'
import { dbConfig } from '../config/database'

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

// Database helpers object
export const dbHelpers = {
  testConnection,
  executeQuery,
  executeTransaction
}

export default pool