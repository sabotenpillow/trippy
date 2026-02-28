import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { auth } from './auth';
import { locales } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'ja',
  localeDetection: true,
  localePrefix: 'as-needed',
});

export default auth((request) => {
  return intlMiddleware(request as NextRequest);
});

export const config = {
  matcher: ['/', '/(en-US|en-GB|ja)/:path*', '/api/auth/:path*'],
};
