import type { NextConfig } from "next";

// dotenv経由で指定するので、型はstringとしておく
const endpointUrl = process.env.NEXT_PUBLIC_ENDPOINT_URL as string;
const yamajiEndpointUrl = process.env.NEXT_PUBLIC_YAMAJI_ENDPOINT_URL as string;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${endpointUrl}/:path*`,
      },
      {
        source: "/api/",
        destination: `${endpointUrl}/`,
      },
      {
        source: "/api-yamaji/:path*",
        destination: `${yamajiEndpointUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
