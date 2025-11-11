import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    // Return user data in consistent format
    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          no_telp: user.no_telp,
          role: user.role
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Session check failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Clear auth-token cookie if exists
    const response = NextResponse.json({
      success: true,
      message: 'Session cleared'
    }, { status: 200 })

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0)
    })

    return response

  } catch (error) {
    console.error('Session clear failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
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

    // Parse request body
    const body = await request.json()
    const { nama, email, no_telp } = body

    // Update user data in database
    const updatedUser = await auth.updateUser(user.id, {
      nama: nama || user.nama,
      email: email || user.email,
      no_telp: no_telp || user.no_telp
    })

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    }, { status: 200 })

  } catch (error) {
    console.error('Update profile failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
