import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validatedData = registerSchema.parse(body);
    
    // Extract confirm password and remove it from user data
    const { confirmPassword, ...userData } = validatedData;
    
    // Check if email already exists
    const existingUser = await registerUser(userData);
    
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }
    
    // Return success response without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = existingUser;
    
    return NextResponse.json(
      {
        success: true,
        message: 'Registrasi berhasil',
        user: userWithoutPassword
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration API error:', error);
    
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
