import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add middleware logic if needed later
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
