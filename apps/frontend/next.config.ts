import { config } from "dotenv";
import type { NextConfig } from "next";
import path from "path";

config({ path: path.resolve(__dirname, "../../.env") });

const nextConfig: NextConfig = {
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    },
};

export default nextConfig;
