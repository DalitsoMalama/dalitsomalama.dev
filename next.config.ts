import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  // The CV page became "Portfolio"; keep links already shared (applications, LinkedIn) working.
  async redirects() {
    return [{ source: "/cv", destination: "/portfolio", permanent: true }];
  },
};

export default nextConfig;
