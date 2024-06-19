const withMDX = require('@next/mdx')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(otf|ttf)/,
      use: [
        {
          loader: './node_modules/vite-plugin-font/dist/webpack.mjs',
          options: {},
        },
      ],
    });
    return config;
  },
  images: {
    domains: ['localhost'],
  },
};

module.exports = withMDX(nextConfig);
