/** @type {import('next').NextConfig} */


// const nextConfig = {};

// Path: next.config.js
const nextConfig = {
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  }
}

export default nextConfig;
