/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚫 Disable Turbopack (fixes Windows source map errors, workspace warnings)
  experimental: {
    turbo: {
      enabled: false,
    },
  },

  // ✅ Fix workspace root warning
  turbopack: {
    root: __dirname,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lmsimage.blob.core.windows.net",
        pathname: "/cmsimages/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdni.iconscout.com",  // ⭐ ADDED FOR LOGIN PAGE IMAGE
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
