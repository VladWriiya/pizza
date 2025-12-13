import { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';
import { routing } from './i18n/routing';

const protectedUserRoutes = ['/profile'];
const protectedAdminRoutes = ['/admin'];
const protectedKitchenRoutes = ['/kitchen'];
const protectedCourierRoutes = ['/courier'];

const intlMiddleware = createIntlMiddleware(routing);

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, 
    },
    pages: {
      signIn: '/', 
    },
  }
);

const adminAuthMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === 'ADMIN',
    },
    pages: {
      signIn: '/denied',
    },
  }
);

const kitchenAuthMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === 'KITCHEN' || token?.role === 'ADMIN',
    },
    pages: {
      signIn: '/denied',
    },
  }
);

const courierAuthMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === 'COURIER' || token?.role === 'ADMIN',
    },
    pages: {
      signIn: '/denied',
    },
  }
);

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isAdminRoute = protectedAdminRoutes.some((route) => pathname.includes(route));
  const isKitchenRoute = protectedKitchenRoutes.some((route) => pathname.includes(route));
  const isCourierRoute = protectedCourierRoutes.some((route) => pathname.includes(route));
  const isUserRoute = protectedUserRoutes.some((route) => pathname.includes(route));

  if (isAdminRoute) {
    return (adminAuthMiddleware as (req: NextRequest) => ReturnType<typeof intlMiddleware>)(req);
  }

  if (isKitchenRoute) {
    return (kitchenAuthMiddleware as (req: NextRequest) => ReturnType<typeof intlMiddleware>)(req);
  }

  if (isCourierRoute) {
    return (courierAuthMiddleware as (req: NextRequest) => ReturnType<typeof intlMiddleware>)(req);
  }

  if (isUserRoute) {
    return (authMiddleware as (req: NextRequest) => ReturnType<typeof intlMiddleware>)(req);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};