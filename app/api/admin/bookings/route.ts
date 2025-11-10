import { NextRequest, NextResponse } from 'next/server'
import { dbHelpers } from '@/lib/database'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = request.headers.get('authorization')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = session.replace('Bearer ', '')
    const user = await auth.getUserFromToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all bookings
    const query = `
      SELECT b.*, u.name as user_name, u.email, l.name as lapangan_name 
      FROM bookings b 
      JOIN users u ON b.user_id = u.id 
      JOIN lapangans l ON b.lapangan_id = l.id 
      ORDER BY b.created_at DESC
    `
    const bookings = await dbHelpers.executeQuery(query)
    
    return NextResponse.json({
      success: true,
      data: bookings || []
    }, { status: 200 })

  } catch (error) {
    console.error('Get all bookings failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}