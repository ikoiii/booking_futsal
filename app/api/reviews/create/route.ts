import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { lapanganId, bookingId, rating, komentar } = await request.json();

    if (!lapanganId || !bookingId || !rating) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user has booked this lapangan
    const booking = await dbHelpers.getBookingById(bookingId);
    
    if (!booking || booking.user_id !== parseInt(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid booking or unauthorized' },
        { status: 403 }
      );
    }

    // Check if user already reviewed this booking
    const existingReview = await dbHelpers.getReviewByBookingId(bookingId);
    
    if (existingReview) {
      return NextResponse.json(
        { success: false, message: 'Review already exists for this booking' },
        { status: 400 }
      );
    }

    // Create the review
    await dbHelpers.createReview({
      user_id: parseInt(userId),
      lapangan_id: parseInt(lapanganId),
      booking_id: parseInt(bookingId),
      rating: parseInt(rating),
      komentar: komentar || ''
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Review created successfully' 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create review' 
      },
      { status: 500 }
    );
  }
}
