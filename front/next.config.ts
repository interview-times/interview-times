import type { NextConfig } from "next";

// dotenv経由で指定するので、型はstringとしておく
const endpointUrl = process.env.NEXT_PUBLIC_ENDPOINT_URL as string;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${endpointUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
