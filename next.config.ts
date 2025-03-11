const nextConfig = {
  reactStrictMode: false, // Strict Mode 끄기
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 ESLint 오류 무시
  },
  images: {
    domains: [
      'i.scdn.co',
      'mosaic.scdn.co',
      'image-cdn-ak.spotifycdn.com',
      'image-cdn-fa.spotifycdn.com',
    ],
  },
};

export default nextConfig;
