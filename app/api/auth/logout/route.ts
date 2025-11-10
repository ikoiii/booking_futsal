import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear the session cookie
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logout successful' 
    });
    
    response.cookies.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
