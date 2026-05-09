import { NextResponse } from 'next/server';

export function proxy() {
  // Add proxy logic if needed later
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/upload/:path*",
    "/onboarding/:path*",
    "/dashboard/:path*",
    "/compose/:path*",
  ],
};
