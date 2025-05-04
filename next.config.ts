import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    // enables styled JSX (if you ever need it)
    styledComponents: false,
  },
}

export default nextConfig
