import { NextRequest, NextResponse } from 'next/server'
import { BookingHelpers } from '@/lib/database.helpers'
import { auth } from '@/lib/auth'
import { executeQuery } from '@/lib/database'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const session = request.headers.get('authorization')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = session.replace('Bearer ', '')
    const user = await auth.getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const bookingId = parseInt(id)
    if (!bookingId || isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid booking ID' },
        { status: 400 }
      )
    }

    // Get booking details
    const bookingQuery = `
      SELECT b.*, u.name as user_name, u.email, l.name as lapangan_name, l.price_per_hour 
      FROM bookings b 
      JOIN users u ON b.user_id = u.id 
      JOIN lapangans l ON b.lapangan_id = l.id 
      WHERE b.id = $1
    `
    const bookingResult = await executeQuery(bookingQuery, [bookingId])
    const booking = Array.isArray(bookingResult) ? bookingResult[0] : null
    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if user owns this booking or is admin
    if (typeof booking === 'object' && 'user_id' in booking) {
      if (booking.user_id !== user.id && user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: booking
    }, { status: 200 })

  } catch (error) {
    console.error('Get booking detail failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const session = request.headers.get('authorization')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = session.replace('Bearer ', '')
    const user = await auth.getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const bookingId = parseInt(id)
    if (!bookingId || isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid booking ID' },
        { status: 400 }
      )
    }

    const { status } = await request.json()

    // Only admin can update booking status
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Validate status
    const validStatuses = ['confirmed', 'cancelled', 'completed']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      )
    }

    // Update booking status
    const updateQuery = 'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2'
    await executeQuery(updateQuery, [status, bookingId])

    return NextResponse.json({
      success: true,
      message: 'Booking status updated successfully'
    }, { status: 200 })

  } catch (error) {
    console.error('Update booking failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const session = request.headers.get('authorization')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = session.replace('Bearer ', '')
    const user = await auth.getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const bookingId = parseInt(id)
    if (!bookingId || isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid booking ID' },
        { status: 400 }
      )
    }

    // Get booking details
    const bookingQuery = `
      SELECT b.*, u.name as user_name, u.email, l.name as lapangan_name, l.price_per_hour 
      FROM bookings b 
      JOIN users u ON b.user_id = u.id 
      JOIN lapangans l ON b.lapangan_id = l.id 
      WHERE b.id = $1
    `
    const bookingResult = await executeQuery(bookingQuery, [bookingId])
    const booking = Array.isArray(bookingResult) ? bookingResult[0] : null
    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if user owns this booking (only user can cancel their own booking)
    if (typeof booking === 'object' && 'user_id' in booking) {
      if (booking.user_id !== user.id && user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Check if booking can be cancelled (not already cancelled or completed)
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return NextResponse.json(
        { success: false, message: 'Booking cannot be cancelled' },
        { status: 400 }
      )
    }

    // Cancel booking
    const cancelQuery = 'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2'
    await executeQuery(cancelQuery, ['cancelled', bookingId])

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully'
    }, { status: 200 })

  } catch (error) {
    console.error('Cancel booking failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}