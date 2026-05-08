import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
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
