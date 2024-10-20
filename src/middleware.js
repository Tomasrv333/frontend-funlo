import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { jwtVerify, JWTExpired } from "jose";
import { jwtDecode } from 'jwt-decode';

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;

  const publicPaths = ['/', '/pages/login', '/pages/register'];
  const url = req.nextUrl.pathname;

  if (publicPaths.includes(url)) {
    return NextResponse.next();
  }

  // Si no hay token, redirigir al login
  if (!token) {
    console.log('No token found, redirecting to /login');
    return NextResponse.redirect(new URL('/pages/login', req.url));
  }

  try {
    const decoded = jwtDecode(token);
    // Aquí puedes agregar lógica adicional, como verificar si el token no ha expirado
    if (decoded.exp * 1000 < Date.now()) {
        return NextResponse.redirect(new URL('/pages/login', req.url));
    }

    return NextResponse.next();
  } catch (error) {
      return NextResponse.redirect(new URL('/pages/login', req.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|login|register).*)',
  ],
};
