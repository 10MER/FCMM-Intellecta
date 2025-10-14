import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // For now, rely on server component guards in pages. Optionally add path-based redirects.
  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/admin/:path*'],
};
