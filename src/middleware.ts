import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwtRole(token: string): string | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload?.role ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const hasAccessToken = 
    request.cookies.get('access_token')?.value || 
    request.cookies.get('access')?.value;

  const hasRefreshToken = 
    request.cookies.get('refresh_token')?.value || 
    request.cookies.get('refresh')?.value;

  // F10 FIX: Verify delivery_boy role strictly from JWT claims
  let userRole: string | null = null;
  if (hasAccessToken) {
    userRole = decodeJwtRole(hasAccessToken);
  }
  if (!userRole && hasRefreshToken) {
    userRole = decodeJwtRole(hasRefreshToken);
  }

  const isDeliveryPartner = userRole === 'delivery_boy';
  const isAuthenticated = Boolean(isDeliveryPartner);

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/login';

  // 1. Not Authenticated Delivery Partner -> Redirect to Login
  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Authenticated Delivery Partner & Trying to access Login -> Redirect to Dashboard
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
