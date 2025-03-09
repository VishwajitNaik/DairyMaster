import { NextResponse } from 'next/server';

export function middleware(request) {
  const userToken = request.cookies.get('userToken')?.value || '';
  const ownerToken = request.cookies.get('ownerToken')?.value || '';
  const sanghToken = request.cookies.get('sanghToken')?.value || '';
  const url = request.nextUrl.pathname;

  console.log("Middleware Running...");
  console.log("Requested URL:", url);
  console.log("User Token:", userToken);
  console.log("Owner Token:", ownerToken);
  console.log("Sangh Token:", sanghToken);

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

  // Redirect to login if user tries to access protected routes without a token
  if (url.startsWith('/user') && !userToken) {
    console.log("Redirecting to / (User not authenticated)");
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Owner can access only /home/:path* but NOT /home/AllDairies/:path*
  if (url.startsWith('/home') && !url.startsWith('/home/AllDairies') && !ownerToken) {
    console.log("Redirecting to / (Owner not authenticated)");
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Ensure owner can access `/home` without issues
  if (url === "/home" && !ownerToken) {
    console.log("Redirecting to / (Owner token missing for /home)");
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Sangh can access only /home/AllDairies/:path*
  if (url.startsWith('/home/AllDairies') && !sanghToken) {
    console.log("Redirecting to / (Sangh not authenticated)");
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.log("Access granted to:", url);
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
