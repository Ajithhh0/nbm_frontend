import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    ADMIN_EMAIL: "info@neurobiomark.co.uk",
    ADMIN_PASSWORD_HASH:
      "$2b$10$Liou6fkXsMVUh4tGUYoMYeHNB4nuPGbSLDGnd7ai1aswkbI7cNS8e",
  },
};

export default nextConfig;
