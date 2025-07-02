import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "95userdocs.s3.ap-south-1.amazonaws.com",
      "95rentalspublic.s3.ap-south-1.amazonaws.com",
    ],
  },
};

export default nextConfig;
