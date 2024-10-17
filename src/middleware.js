import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('token')?.value;

  // Definir las rutas públicas que no requieren autenticación
  const publicPaths = ['/', '/pages/login', '/pages/register'];

  // Obtener la URL actual de la solicitud
  const url = req.nextUrl.pathname;

  // Si la ruta está en publicPaths, no hace falta autenticación
  if (publicPaths.includes(url)) {
    return NextResponse.next(); // Dejar pasar sin verificación de token
  }

  // Si no hay token, redirigir al login
  if (!token) {
    console.log('No token found, redirecting to /login');
    return NextResponse.redirect(new URL('/pages/login', req.url));
  }

  // Si hay token, permitir el acceso
  return NextResponse.next();
}

// Configurar las rutas en las que se aplicará el middleware
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|login|register).*)', // Todas las rutas menos login, register y landing page
  ],
};