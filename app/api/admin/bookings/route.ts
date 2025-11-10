import { NextRequest, NextResponse } from 'next/server'
import { BookingHelpers } from '@/lib/database.helpers'
import { auth } from '@/lib/auth'
import { executeQuery } from '@/lib/database'

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
    const bookings = await BookingHelpers.getAllBookings()
    
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