import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validatedData = loginSchema.parse(body);
    
    // Attempt to login user
    const user = await loginUser(validatedData.email, validatedData.password);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email atau password salah' },
        { status: 401 }
      );
    }
    
    // Generate JWT token (in real implementation, use proper JWT library)
    const token = Buffer.from(JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    })).toString('base64');

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login berhasil',
        user: user,
        token: token
      },
      { status: 200 }
    );

    // Also set cookie as backup
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return response;
    
  } catch (error) {
    console.error('Login API error:', error);
    
    if (error instanceof Error && 'issues' in error) {
      // Zod validation error
      const zodError = error as any;
      return NextResponse.json(
        {
          success: false,
          message: 'Validasi data gagal',
          errors: zodError.issues?.map((issue: any) => ({
            field: issue.path[0],
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }
    
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
