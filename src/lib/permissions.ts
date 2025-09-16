export const isPublicRoutes = ['/auth(.*)', '/'];

export const isProtectedRoutes = ['/dashboard(.*)'];

export const isBypassRoutes = [
  '/api/polar/webhook',
  '/api/ingest(.*)',
  '/api/auth/(.*)',
  '/convex(.*)',
];
