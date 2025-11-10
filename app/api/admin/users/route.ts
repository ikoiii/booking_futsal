import { NextRequest, NextResponse } from 'next/server'
import { UserHelpers } from '@/lib/database.helpers'
import { auth } from '@/lib/auth'

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

    // Get all users
    const users = await UserHelpers.getAllUsers()
    
    return NextResponse.json({
      success: true,
      data: users || []
    }, { status: 200 })

  } catch (error) {
    console.error('Get all users failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}