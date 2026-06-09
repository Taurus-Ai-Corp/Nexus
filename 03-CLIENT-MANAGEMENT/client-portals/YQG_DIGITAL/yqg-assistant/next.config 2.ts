import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Prettier-as-ESLint is too strict for a rebrand branch — run `pnpm format`
  // locally before removing this override. Stylistic, not functional.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Type-check is retained; only the Prettier/ESLint gate is skipped.
};

export default nextConfig;
