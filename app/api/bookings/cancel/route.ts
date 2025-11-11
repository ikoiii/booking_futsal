import { NextRequest, NextResponse } from 'next/server';
import { BookingHelpers } from '@/lib/database.helpers';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication via Bearer token
    const session = request.headers.get('authorization')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = session.replace('Bearer ', '')
    const user = await auth.getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    // Check if booking exists and belongs to user
    const booking = await BookingHelpers.getBookingById(bookingId);
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.user_id !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized to cancel this booking' }, { status: 403 })
    }

    // Check if booking can be cancelled (not too close to start time)
    const now = new Date();
    const bookingTime = new Date(booking.tanggal + ' ' + booking.jam_mulai);
    const timeDiff = bookingTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 2) {
      return NextResponse.json({
        error: 'Cannot cancel booking less than 2 hours before start time'
      }, { status: 400 })
    }

    // Cancel the booking
    await BookingHelpers.updateBookingStatus(bookingId, 'cancelled');

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully'
    }, { status: 200 })

  } catch (error) {
    console.error('Cancel booking failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}