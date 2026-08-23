/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/v1/:path*',
          destination: 'http://127.0.0.1:8000/api/v1/:path*',
        },
        {
          source: '/health',
          destination: 'http://127.0.0.1:8000/health',
        },
        {
          source: '/docs',
          destination: 'http://127.0.0.1:8000/docs',
        },
        {
          source: '/openapi.json',
          destination: 'http://127.0.0.1:8000/openapi.json',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;


