// import { NextResponse } from "next/server";

// export function middleware(request){
//     const path = request.nextUrl.pathname;
//     const isPublicPath = path === "/"
//     const token = request.cookies.get('token')?.value || '';

//     if(isPublicPath && token){
//         return NextResponse.redirect(new URL('/', request.nextUrl));
//     }
//     if(!isPublicPath && !token) {
//         return NextResponse.redirect(new URL("/home/login", request.nextUrl))
//     }
//     return NextResponse.next()
// }

// export const config = {
//     matcher: [
//         "/",
//         '/home/:path*'

//     ]
// }