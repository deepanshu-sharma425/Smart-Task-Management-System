import { NextResponse } from 'next/server';
import { AuthService } from '@db/services/AuthService';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, password } = data;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const authService = AuthService.getInstance();
    const result = await authService.signup(data);

    // Set HTTP-only cookie for the JWT token
    const cookieStore = await cookies();
    cookieStore.set('taskforge-token', result.session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message || 'Signup failed' }, { status: 500 });
  }
}
