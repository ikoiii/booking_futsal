// Authentication middleware
import { NextRequest, NextResponse } from 'next/server'
import { authConfig } from '../config/auth'

export function withAuth(handler: (req: NextRequest, context: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context: any) => {
    // Check for session cookie or auth header
    const sessionCookie = req.cookies.get('session')?.value
    const authHeader = req.headers.get('authorization')

    if (!sessionCookie && !authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Here you would validate the session or token
    // For now, we'll just pass through
    return handler(req, context)
  }
}

export function withAdminAuth(handler: (req: NextRequest, context: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context: any) => {
    const sessionCookie = req.cookies.get('session')?.value

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      )
    }

    // Here you would validate the admin session
    // and check if user has admin role
    return handler(req, context)
  }
}