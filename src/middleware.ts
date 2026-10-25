import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
  const binary = atob(pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function verifyJwtRole(token: string): Promise<string | null> {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;

    const secretKey =
      process.env.JWT_SECRET_KEY ||
      process.env.DJANGO_SECRET_KEY ||
      process.env.SECRET_KEY ||
      'django-insecure-5t=7)&fav4_i&o!*ftlu^1#s$xx*fk1q4a!94r$&t+hn4pz=s2';

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secretKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = base64UrlToUint8Array(sigB64);
    const dataBytes = enc.encode(`${headerB64}.${payloadB64}`);

    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes as any, dataBytes as any);
    if (!isValid) return null;

    const payloadBytes = base64UrlToUint8Array(payloadB64);
    const payloadStr = new TextDecoder().decode(payloadBytes as any);
    const payload = JSON.parse(payloadStr);

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload?.role ?? null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const hasAccessToken = 
    request.cookies.get('access_token')?.value || 
    request.cookies.get('access')?.value;

  const hasRefreshToken = 
    request.cookies.get('refresh_token')?.value || 
    request.cookies.get('refresh')?.value;

  // F10 FIX: Cryptographically verify delivery_boy role directly from HMAC signature
  let userRole: string | null = null;
  if (hasAccessToken) {
    userRole = await verifyJwtRole(hasAccessToken);
  }
  if (!userRole && hasRefreshToken) {
    userRole = await verifyJwtRole(hasRefreshToken);
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
