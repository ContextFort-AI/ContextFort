/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  trailingSlash: true,
  reactCompiler: true,
  compiler: {
    // Keep console.log for debugging in extension
    removeConsole: false,
  },
  // Static export doesn't support redirects, handle in client-side code
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
