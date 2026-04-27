import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'forge-your-future-with-taskforge-2026';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public paths
  const isPublicPath =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/api/auth');

  const token = request.cookies.get('taskforge-token')?.value;

  // Protect dashboard and member pages
  if (!isPublicPath && !token) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    // jhkhh
    try {
      // Verify JWT
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      // Role-based redirection logic
      if (pathname === '/login' || pathname === '/signup') {
        return NextResponse.redirect(new URL(role === 'admin' ? '/dashboard' : '/member', request.url));
      }

      if (pathname.startsWith('/dashboard') && role !== 'admin') {
        return NextResponse.redirect(new URL('/member', request.url));
      }

      if (pathname.startsWith('/member') && role !== 'member') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

    } catch (error) {
      // Token invalid or expired
      if (!isPublicPath) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('taskforge-token');
        return response;
      }
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/member/:path*',
    '/api/:path*',
    '/login',
    '/signup',
  ],
};
