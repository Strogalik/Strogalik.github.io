import type { NextConfig } from 'next';
const pages = process.env.TMS_GITHUB_PAGES === 'true';
const config: NextConfig = {
  poweredByHeader: false,
  output: pages ? 'export' : 'standalone',
  trailingSlash: pages,
  images: { formats: ['image/avif', 'image/webp'], unoptimized: pages },
  ...(!pages ? {async redirects() { return [{ source: '/products/brm', destination: '/custom-development', permanent: true }]; },
  async headers() {
    return [{ source: '/(.*)', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] }];
  }} : {}),
};
export default config;
