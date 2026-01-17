import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

const isApiRoute = (pathname: string) =>
  pathname.startsWith('/api');

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 🔐 API routes → return 401 (NO redirect)
  if (isApiRoute(pathname)) {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Unauthorized',
            code: 'AUTH_UNAUTHORIZED',
          },
        },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // 🔐 Page routes → redirect to sign-in
  await auth.protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|png|jpg|jpeg|svg|gif|ico|woff2?|ttf)).*)',
    '/(api|trpc)(.*)',
  ],
};
