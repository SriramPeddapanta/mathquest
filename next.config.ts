import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // If deployed to a subpath on GitHub Pages, e.g. https://username.github.io/repo-name/
  basePath: '/mathquest',
};

export default nextConfig;
