/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jahidblogappab88997f523349a79f46c2b5f1ddbf2f132058-dev.s3.eu-north-1.amazonaws.com',
      },
    ],
  }
}

module.exports = nextConfig
