import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Not exporting as static, keep default server build so API routes (nodemailer) work on Vercel serverless functions.
  images: { unoptimized: true },
  basePath: "/apae-site-comemorativo",
  reactStrictMode: true,
};

export default nextConfig;
