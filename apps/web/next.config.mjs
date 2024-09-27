/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  images: {
    domains: ["storage.googleapis.com"],
  },
  output: "standalone",
  //   experimental: {
  //     reactCompiler: true,
  //   },
};

export default nextConfig;
