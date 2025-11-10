import { NextRequest, NextResponse } from 'next/server';
import { BookingHelpers } from '@/lib/database.helpers';

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Check if booking exists and belongs to user
    const booking = await BookingHelpers.getBookingById(bookingId);
    
    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    if (booking.user_id !== parseInt(userId)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to cancel this booking' },
        { status: 403 }
      );
    }

    // Check if booking can be cancelled (not too close to start time)
    const now = new Date();
    const bookingTime = new Date(booking.tanggal + ' ' + booking.jam_mulai);
    const timeDiff = bookingTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 2) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cannot cancel booking less than 2 hours before start time' 
        },
        { status: 400 }
      );
    }

    // Cancel the booking
    await BookingHelpers.cancelBooking(bookingId);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Booking cancelled successfully' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Cancel booking error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to cancel booking' 
      },
      { status: 500 }
    );
  }
}