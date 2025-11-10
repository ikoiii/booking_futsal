import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from cookie
    const userId = request.cookies.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada sesi' },
        { status: 401 }
      );
    }
    
    // Get user data
    const user = await getUserById(parseInt(userId));
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        user: user
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Session API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
    return NextResponse.json(
      {
        success: false,
        message: errorMessage
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Logout user by clearing cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout berhasil'
      },
      { status: 200 }
    );
    
    // Clear the session cookie
    response.cookies.set('userId', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0) // Expire immediately
    });
    
    return response;
    
  } catch (error) {
    console.error('Logout API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
    return NextResponse.json(
      {
        success: false,
        message: errorMessage
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get user ID from cookie
    const userId = request.cookies.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada sesi' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { name, email, phone } = body;
    
    // Get current user data
    const currentUser = await getUserById(parseInt(userId));
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Update user data (in real app, you would update in database)
    // For now, just return updated user data
    const updatedUser = {
      ...currentUser,
      nama: name || currentUser.nama,
      email: email || currentUser.email,
      no_telp: phone || currentUser.no_telp,
      updated_at: new Date().toISOString()
    };
    
    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Update profile API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
    return NextResponse.json(
      {
        success: false,
        message: errorMessage
      },
      { status: 500 }
    );
  }
}
