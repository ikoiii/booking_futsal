import { NextRequest, NextResponse } from 'next/server'
import { dbHelpers } from '@/lib/database'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const bookingId = parseInt(params.id)
    if (!bookingId || isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid booking ID' },
        { status: 400 }
      )
    }

    // Get booking details
    const booking = await dbHelpers.getBookingById(bookingId)
    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if user owns this booking or is admin
    if (booking.user_id !== user.id && user.role !== 'admin') {
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const bookingId = parseInt(params.id)
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
    await dbHelpers.updateBookingStatus(bookingId, status)

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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const bookingId = parseInt(params.id)
    if (!bookingId || isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid booking ID' },
        { status: 400 }
      )
    }

    // Get booking details
    const booking = await dbHelpers.getBookingById(bookingId)
    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if user owns this booking (only user can cancel their own booking)
    if (booking.user_id !== user.id && user.role !== 'admin') {
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
    await dbHelpers.cancelBooking(bookingId)

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