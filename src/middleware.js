// /middleware.js or appropriate middleware file
import { NextResponse } from 'next/server';

// No need to import models or connect to the database here, as middleware runs on the Edge Runtime
// and doesn't have access to the server-side environment.
// Instead, token verification should be handled through secure methods like JWT verification.

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Define path checks
  const isRootPath = path === '/';
  const isSigninPath = path === '/home/Signin';
  const isSanghAuthPath = path === '/home/AllDairies';
  const isResetPassword = path.startsWith('/home/reset-password');
  const isVerifyPassword = path.startsWith('/home/reset');
  const isUserAccess = path.startsWith('/home/milkRecords/getMilksUserSide');
  const isSignUpUser = path.startsWith('/home/CreateUser/AddUser');
  const isSignInUser = path.startsWith('/home/CreateUser/LoginUser');
  const updateOwner = path.startsWith('/home/owner/updateOwner');
  const isOwnerAccess = path.startsWith('/home/owner'); // Example owner path

  // Check for user, owner, and sangh tokens
  const userToken = request.cookies.get('userToken')?.value || '';
  const ownerToken = request.cookies.get('ownerToken')?.value || '';
  const sanghToken = request.cookies.get('sanghToken')?.value || '';

  console.log(`Middleware invoked. Path: ${path}. SanghToken: ${sanghToken}`);

  // Handle redirection logic

  // 1. Redirect authenticated Users or Owners away from Signin Path to /home
  if ((userToken || ownerToken) && isSigninPath) {
    console.log('User or Owner authenticated, redirecting to /home');
    return NextResponse.redirect(new URL('/home', request.nextUrl));
  }

  // 2. Redirect authenticated Sanghs away from Signin Path to /home/AllDairies
  if (sanghToken && isSigninPath) {
    console.log('Sangh authenticated, redirecting to /home/AllDairies');
    return NextResponse.redirect(new URL('/home/AllDairies', request.nextUrl));
  }

  // 3. Ensure that only authenticated Sangh users can access the /home/AllDairies path
  if (!sanghToken && isSanghAuthPath) {
    console.log('Sangh user not authenticated, redirecting to /');
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // 4. Protect User, Owner, and other specific paths
  if (
    (isUserAccess && !userToken) ||
    (isOwnerAccess && !ownerToken) ||
    (isSignUpUser && !ownerToken) || // Assuming only Owners can sign up Users
    (isSignInUser && !ownerToken) || // Assuming only Owners can sign in Users
    (!userToken && !ownerToken && !sanghToken && 
      !isRootPath && !isSigninPath && !isResetPassword && 
      !isVerifyPassword && !isSignUpUser && !isSignInUser)
  ) {
    console.log('User, Owner, or Sangh not authenticated, redirecting to /');
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // 5. Allow authenticated Sanghs to access /home/AllDairies and other protected routes
  // 6. Allow all users to access the root path (/)

  // If none of the above conditions are met, allow the request to proceed
  console.log('Allowing request to proceed');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/', // Root path
    '/home',
    '/home/:path*',
    '/home/Signin',
    '/home/reset-password/:token*',
    '/home/reset',
    '/home/CreateUser/AddUser',
    '/home/CreateUser/LoginUser',
    '/home/milkRecords/getMilksUserSide/:path*',
    '/home/owner/:path*', // Example owner path
    '/home/AllDairies/:path*', // Ensure only logged-in Sangh users can access this path
    '/home/updateDetails/OnwerUpdate/:path*'
  ],
};
