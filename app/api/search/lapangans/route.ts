import { NextRequest, NextResponse } from 'next/server'
import { LapanganHelpers } from '@/lib/database.helpers'
import { executeQuery } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    
    const keyword = searchParams.get('q') || ''
    const location = searchParams.get('location') || ''
    const minPrice = searchParams.get('min_price') ? parseInt(searchParams.get('min_price') || '0') : null
    const maxPrice = searchParams.get('max_price') ? parseInt(searchParams.get('max_price') || '999999') : null
    const facilities = searchParams.get('facilities') ? searchParams.get('facilities')?.split(',') : []
    
    // Build query
    let query = `
      SELECT * FROM lapangans 
      WHERE status = 'aktif'
    `
    let params: any[] = []
    
    if (keyword) {
      query += ' AND (nama LIKE ? OR deskripsi LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`)
    }
    
    if (location) {
      query += ' AND lokasi LIKE ?'
      params.push(`%${location}%`)
    }
    
    if (minPrice !== null) {
      query += ' AND harga_per_jam >= ?'
      params.push(minPrice)
    }
    
    if (maxPrice !== null) {
      query += ' AND harga_per_jam <= ?'
      params.push(maxPrice)
    }
    
    query += ' ORDER BY harga_per_jam'
    
    // Execute query
    const results = await executeQuery(query, params)
    
    return NextResponse.json({
      success: true,
      data: results || []
    }, { status: 200 })

  } catch (error) {
    console.error('Search lapangans failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}