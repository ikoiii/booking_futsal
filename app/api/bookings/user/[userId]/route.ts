import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/database';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId;

    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const bookings = await dbHelpers.getBookingsByUserId(parseInt(userId));

    return NextResponse.json(
      {
        success: true,
        bookings: bookings || []
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch bookings'
      },
      { status: 500 }
    );
  }
}
