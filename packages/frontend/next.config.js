/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用严格模式
  reactStrictMode: true,
  
  // 忽略由浏览器扩展引起的hydration警告
  compiler: {
    // 移除console.log
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // Proxy to Backend
      },
    ]
  },
}

module.exports = nextConfig 