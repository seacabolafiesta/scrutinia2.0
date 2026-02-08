import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect the admin route
  if (pathname.startsWith('/revisionmanual-scrutinia')) {
    const token = req.cookies.get('scrutinia-admin')?.value;

    if (!token) {
      // Redirect to login page
      const loginUrl = new URL('/admin-login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token contains the secret
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const secret = process.env.ADMIN_SESSION_SECRET || 'fallback-secret';
      if (!decoded.includes(secret)) {
        const loginUrl = new URL('/admin-login', req.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      const loginUrl = new URL('/admin-login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/revisionmanual-scrutinia/:path*'],
};
