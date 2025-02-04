import { NextResponse } from 'next/server';

export function middleware(request) {
  const userToken = request.cookies.get('userToken')?.value || '';
  const ownerToken = request.cookies.get('ownerToken')?.value || '';
  const sanghToken = request.cookies.get('sanghToken')?.value || '';
  const url = request.nextUrl.pathname;

  // Public routes (accessible without authentication)
  const publicRoutes = [
    '/home/Signin',
    '/home/reset-password',
    '/home/reset',
    '/home/AllDairies/reset-password',
    '/home/AllDairies/reset'
  ];

  // Allow access to public routes without authentication
  if (publicRoutes.includes(url) || publicRoutes.some(route => url.startsWith(route))) {
    return NextResponse.next();
  }

  // User can access only /user/:path*
  if (url.startsWith('/user') && !userToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Owner can access only /home/:path* but NOT /home/AllDairies/:path*
  if (url.startsWith('/home') && !url.startsWith('/home/AllDairies') && !ownerToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Sangh can access only /home/AllDairies/:path*
  if (url.startsWith('/home/AllDairies') && !sanghToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next(); // Allow request to continue if valid
}

// Apply middleware to all relevant routes
export const config = {
  matcher: [
    '/user/:path*',
    '/home/:path*',
    '/home/AllDairies/:path*',
  ],
};
