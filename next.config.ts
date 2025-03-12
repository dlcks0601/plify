/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'i.scdn.co',
      'mosaic.scdn.co',
      'image-cdn-ak.spotifycdn.com',
      'image-cdn-fa.spotifycdn.com',
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // inline script를 허용하거나 필요한 nonce/해시를 추가할 수 있음
            value:
              "default-src 'self'; script-src 'self' https://sdk.scdn.co 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
